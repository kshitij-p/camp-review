const mongoose = require('mongoose');

const [Camp, Review] = require('../models/camp');


module.exports.checkUser = async function(req, res, next) {
    const {id} = req.params;
    
    const camp = await Camp.findById(id);
    
    if((!req.user) || (!camp.user._id.equals(req.user._id))){
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/camps/${id}`);
    }
    next();
}


