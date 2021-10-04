const express = require('express');


const app = express();
const Joi = require('joi');

const [Camp] = require('../models/camp');
const isLoggedIn = require('../utils/isLoggedIn');

const validateCamp = require('../utils/validateCamp')
const {checkUser} = require('../utils/checkUser');

const catchAsync = require('../utils/catchAsync')
const CustomError = require('../utils/CustomError')


const multer = require('multer');
const {cloudinary} = require('../cloudinary/cloudinary')
const {storage} = require('../cloudinary/cloudinary')
const upload = multer({storage});

const campController = require('../controllers/campController');

const campRouter = express.Router();



campRouter.route('/')
    .get(catchAsync(campController.index))
    .post(isLoggedIn, upload.array('image', 4), validateCamp, catchAsync(campController.post));

campRouter.get('/api/loadcamps', catchAsync(campController.loadcamps))          //infinite scroll

campRouter.get('/new', isLoggedIn, catchAsync(campController.new))

campRouter.route('/:id')
    .get(catchAsync(campController.show))
    .put(isLoggedIn, checkUser, upload.array('addImage', 4), validateCamp, catchAsync(campController.put))
    
    .delete(isLoggedIn, checkUser, catchAsync(campController.destroy));

campRouter.get('/:id/delete', isLoggedIn, checkUser, catchAsync(campController.displayDelete));

campRouter.get('/:id/edit', isLoggedIn, checkUser, catchAsync(campController.edit));

campRouter.get('/:id/reviews', (req, res)=> {
    const {id} = req.params;
    res.redirect(`/camps/${id}`);
})



module.exports = campRouter;