const [Camp, Review] = require('../models/camp');
const mongoose = require('mongoose');

module.exports.checkReviewUser = async function(req, res, next) {
    const {id, rid} = req.params;
    const review = await Review.findById(rid);
    
    if(!req.user || !review.user._id.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/camps/${id}`);
    }
    next();
}
