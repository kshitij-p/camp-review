const express = require('express');
const app = express();

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const isLoggedIn = require('../utils/isLoggedIn');

const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/', (req, res)=> {
    res.send("LMAO");
})

userRouter.route('/login')
    .get(userController.login)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), 
    userController.postLogin)



userRouter.route('/register')
    .get(userController.register)
    .post(userController.postRegister);


userRouter.get('/logout', userController.logout);

module.exports = userRouter;