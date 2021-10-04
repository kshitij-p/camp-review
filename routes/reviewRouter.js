const express = require('express');

const app = express();
const Joi = require('joi');

const [Camp, Review] = require('../models/camp');

const isLoggedIn = require('../utils/isLoggedIn');
const validateReview = require('../utils/validateReview');
const {checkReviewUser} = require('../utils/checkReviewUser');

const catchAsync = require('../utils/catchAsync')
const CustomError = require('../utils/CustomError')

const reviewController = require('../controllers/reviewController');

const reviewRouter = express.Router({mergeParams: true});


reviewRouter.get('/:rid/edit', catchAsync(reviewController.edit))

reviewRouter.post('/', isLoggedIn, 
validateReview, catchAsync(reviewController.post));



reviewRouter.put('/:rid', 
isLoggedIn, checkReviewUser, 
validateReview, catchAsync(reviewController.put));



reviewRouter.delete('/:rid', isLoggedIn, checkReviewUser, catchAsync(reviewController.destroy)); 

module.exports = reviewRouter;