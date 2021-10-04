if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const app = express();
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const catchAsync = require('./utils/catchAsync')
const CustomError = require('./utils/CustomError')

const {scriptUrls, styleSrcUrls, connectSrcUrls} = require('./utils/contentSecurityPolicy');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const [Camp] = require('./models/camp');

const campRouter = require('./routes/campRouter');
const reviewRouter = require('./routes/reviewRouter');
const userRouter = require('./routes/userRouter');
const { cloudinary } = require('./cloudinary/cloudinary');
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/campApp';
const secret = process.env.SECRET || 'badsecret';

const store = new MongoStore({mongoUrl: dbUrl, secret: secret, touchAfter: 24 * 60 *60})

store.on("error", (e)=> {
    console.log(e);
});

app.set('trust proxy', 1);

const sessionConfig = {
    store: store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:  1000*60*60*24*7
        
    }
}



mongoose.connect(dbUrl, {autoIndex: false});



app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/",
            "https://images.unsplash.com/"
            

        ],
        fontSrc: ["'self'"]
    }
}))

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=> {
    
    if(!['/login', '/register', '/camps/api/loadcamps'].includes(req.originalUrl)){
        
        
        req.session.toRedirect = req.originalUrl;
    } 
    res.locals.currUser = req.user;
    
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.get('/', (req, res)=> {
    
   
    res.render('home.ejs');
})


app.use('/', userRouter);
app.use('/camps', campRouter);
app.use('/camps/:id/reviews', reviewRouter);


app.all('*', (req, res)=> {
    throw new CustomError(404, "Page Not Found - Invalid URL");
})

app.use((e, req, res, next)=> {
    if(e.name === "MulterError"){
        
        req.flash('error', 'Max limit for photos is 4!');
        
        return res.redirect("/camps");
    } else {
        next(e);
    }
})

app.use((e, req, res, next)=> {
    let {errCode = 500, message = "Oh nyo something went wrong!"} = e;

    if(e.message){
        message = e.message
    }

    

    res.status(errCode).render('error.ejs', {message, e});
})


const port = process.env.PORT || 3000;
app.listen(port, (req, res)=>{

    console.log(`Serving on ${port}`);
})