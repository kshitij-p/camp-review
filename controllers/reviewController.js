const mongoose = require('mongoose');
const [Camp, Review] = require('../models/camp');

module.exports.post = async(req, res)=> {
    const {id} = req.params;
    const {review: info} = req.body;
    
    console.log(info);

    const camp = await Camp.findById(id);
    const review = await new Review(info);
    
    camp.reviews.push(review._id);
    review.camp = camp._id;
    review.user = req.user._id;

    await camp.save();
    await review.save();

    req.flash('success', 'Created a review!');
    res.redirect(`/camps/${id}`);
}

module.exports.edit = async(req, res, next)=> {
    const {id, rid} = req.params; 
    const camp = await Camp.findById(id);
    const review = await Review.findById(rid);
    res.render('reviews/edit.ejs', {camp, review});
}

module.exports.put = async(req, res, next)=> {
    const {id, rid} = req.params;
    const {review: info} = req.body;
    
    const review = await Review.findByIdAndUpdate(rid, info);
    req.flash('success', 'Edited the review!');
    res.redirect(`/camps/${id}`);
}

module.exports.destroy = async(req, res, next)=> {
    const {id, rid} = req.params;
    const review = await Review.findByIdAndDelete(rid);
    req.flash('success', 'Deleted the review!');
    res.redirect(`/camps/${id}`)
}