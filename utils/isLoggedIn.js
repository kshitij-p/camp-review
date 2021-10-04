
const isLoggedIn = function(req, res, next) {
    if(!req.isAuthenticated()){
             
              
        
        req.flash('error', 'You must login first!')
        return res.redirect('/login');
    }
    else {
        
        next();
    }
}

module.exports = isLoggedIn;