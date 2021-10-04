const express = require('express');
const User = require('../models/user');
const passport = require('passport');

module.exports.register = async(req, res)=> {
    if(req.isAuthenticated()){
        req.flash('error', 'You are already logged!');
        return res.redirect('/camps');
    }
    res.render('userAuth/register');
};

module.exports.login = (req, res)=> {
    if(req.isAuthenticated()){
        req.flash('error', 'You are already logged!');
        return res.redirect('/camps');
    }
              
    res.render('userAuth/login');
}

module.exports.postLogin = async(req, res)=> {

    const{id} = req.params;

    const redirectUrl = req.session.toRedirect || '/camps';

    delete req.session.toRedirect;

        
    req.flash('success', 'Login successful!');
    res.redirect(redirectUrl);

};

module.exports.logout = (req, res)=> {
    
    if(!req.isAuthenticated()) {
        req.flash('error', "You must be logged in to logout!")
        return res.redirect('/');
    }
    req.logout();
    
    req.flash('success', "Logged out successfully!");
    res.redirect('/');

}

module.exports.postRegister = async(req, res)=> {
    
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username: email});
        const registeredUser = await User.register(user, password);
        await req.login(registeredUser, (e)=> {
            if(e){
                return next(e);
            }
            
        })
        req.flash('success', "Welcome to Camp Review !");

        res.redirect('/'); 
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
    
}