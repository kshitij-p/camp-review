const mongoose = require('mongoose');
const [Camp] = require('../models/camp');

const cities = require('./citylist');
const {descriptors, places} = require('./campdatagen');
const findMap = require('../utils/findMap');

mongoose.connect("mongodb+srv://admin-kshitij:5i3Uhfj16RBZIZKF@campreview.kynsx.mongodb.net/campreview?retryWrites=true&w=majority");

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
            user: '615af1a5020d141ebf4fad93',
            image: [{url : "https://res.cloudinary.com/dmyr4hycj/image/upload/v1632488618/CampReview/spny8ay5e9vjooplhyeo.jpg", 
            filename : "CampReview/spny8ay5e9vjooplhyeo" }, 
            { url : "https://res.cloudinary.com/dmyr4hycj/image/upload/v1632488618/CampReview/yvmqax4kktinyiybdhvh.webp", filename : "CampReview/yvmqax4kktinyiybdhvh" } ],
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

