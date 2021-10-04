const mongoose = require('mongoose');
const [Camp] = require('../models/camp');

const cities = require('./citylist');
const {descriptors, places} = require('./campdatagen');
const findMap = require('../utils/findMap');

mongoose.connect('mongodb://localhost:27017/campApp');

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const arrRand = (array)=> {
    return array[Math.floor(Math.random() * array.length)];
}

const lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure alias eligendi asperiores maxime et quasi voluptatibus voluptates maiores, dolorem placeat deserunt fugit corrupti ipsa sunt? Porro iusto pariatur nobis iure.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure alias eligendi asperiores maxime et quasi voluptatibus voluptates maiores, dolorem placeat deserunt fugit corrupti ipsa sunt? Porro iusto pariatur nobis iure."
const randImage = "https://source.unsplash.com/collection/2184453";
const seed = async() => {

    await Camp.deleteMany({});
    
    for(let i =0; i<10; i++){
        let randCity = arrRand(cities)
        
        const camp = new Camp(
            {location: `${randCity.city}, ${randCity.state}`,
            name: `${arrRand(descriptors)} ${arrRand(places)}`,
            description: lorem,
            price: Math.floor(Math.random()*40)+9,
            user: '6149db1f87c1f52124611cc8',
            image: [{url : "https://res.cloudinary.com/dmyr4hycj/image/upload/v1632487320/CampReview/js1czchiuglgjc04wsqt.jpg", 
            filename : "CampReview/js1czchiuglgjc04wsqt" }, 
            { url : "https://res.cloudinary.com/dmyr4hycj/image/upload/v1632487320/CampReview/ek4xesbiabttws1cl2r8.webp", filename : "CampReview/ek4xesbiabttws1cl2r8" } ],
            map: {type: "Point", coordinates: [randCity.longitude, randCity.latitude]}
            })
         

        await camp.save();
    }
    xd = await Camp.find({});
    console.log(xd);
    mongoose.connection.close();
} 

const check = async()=> {
    
}


seed();

