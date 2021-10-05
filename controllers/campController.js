const express = require('express');
const validateCamp = require('../utils/validateCamp')
const {checkUser} = require('../utils/checkUser');
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCodingClient = mbxClient({accessToken: process.env.MAPBOX_TOKEN});
const [Camp] = require('../models/camp');

const {cloudinary} = require('../cloudinary/cloudinary')

const findMap = require('../utils/findMap');
const CustomError = require('../utils/CustomError');

const checkLast = async (currentPosition)=> {
    const camps = await Camp.count({});
    if(currentPosition>=camps){
        
        return true;
    }else {
        
        return false;
    }
}

module.exports.index = async(req, res)=> {
    const camps = await Camp.find({}).limit(5)/* .sort({name: 'asc'}).limit(2) */;
    
    res.render('camps/index.ejs', {camps})
};

module.exports.show = async(req, res)=> {
    const {id} = req.params;
    const camp = await Camp.findById(id).populate(
        {path:'reviews', populate: {
            path: 'user'}
        }).populate('user');
    
    res.render('camps/show.ejs', {camp});
}

module.exports.new = async(req, res)=> {
   

    
    res.render('camps/new.ejs');
}

module.exports.post = async(req, res, next)=> {
    const {name, location, description, price} = req.body;

    coords = await findMap(location);
    
    
    

    const image = req.files.map((x)=> {return {url: x.path, filename: x.filename}});
            
    const camp = new Camp({name, location, image, description, price, map: coords});
    camp.user = req.user._id;

    
    
    await camp.save();
    

    req.flash('success', 'Created a camp!');
    res.redirect('/camps');
    
        
    
    
};

module.exports.edit = async(req, res)=> {
    const {id} = req.params;
    const camp = await Camp.findById(id);
    res.render('camps/edit', {camp});
}

module.exports.put = async(req, res)=> {
    const {id} = req.params;
    const {name, location, description, price, deleteImages} = req.body;
    
    
    
    const camp = await Camp.findByIdAndUpdate(id, {name, location, description, price}, {runValidators: true});
    /* Add images */
    if(req.files.length){
        const images = req.files.map((x)=> {return {url: x.path, filename: x.filename}});
        for(let i of images){
            camp.image.push(i);
        }
    }
    /* Add images ^ */


    if(deleteImages) {
        for(let filename of deleteImages){
            cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull: {image: {filename: {$in: deleteImages}}}});
        
    }

    const coords = await findMap(location);
    
    
    camp.map = coords;

    await camp.save();
    

    req.flash('success', 'Edited the camp!');
    res.redirect(`/camps/${id}`);
}

module.exports.displayDelete = async(req, res)=> {
    const {id} = req.params;
    const camp = await Camp.findById(id);
    res.render('camps/delete.ejs', {camp});
}

module.exports.destroy = async(req, res)=> {
    const {id} = req.params;
    const camp = await Camp.findByIdAndDelete(id);
    req.flash('success', 'Deleted the camp!');

    res.redirect('/camps');
}

module.exports.loadcamps = async(req, res, next)=> {
    const browser = req.get('user-agent');

    if(browser.match(/(firefox|msie|chrome|safari)[/\s]([\d.]+)/ig) == null){
        throw new CustomError(400, "Bad request - cannot make this request outside of browser")
    }

    if(!req.get('lastCamp')){
       throw new CustomError(400, "Bad request!")
    }
    

    try {
        const header = req.get('lastCamp');
    
        const camp = await Camp.findOne({id: header});
        
        const isLast = await checkLast(camp.id);
        
        if(isLast) {
            
            return res.end();
        }
        const nextCamps = await Camp.find({id: {$gt: camp.id}}).limit(2);
        res.json(nextCamps);

    } catch (e){
        next(e);
    }
}

