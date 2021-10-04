const mongoose = require('mongoose');
const User = require('./user');
const {cloudinary} = require('../cloudinary/cloudinary')


imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('upload', '/upload/w_200')
})



campSchema = new mongoose.Schema({

    name: String,
    image: [imageSchema],
    map: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
             required: true
        }

    },
    price: Number,
    description: String,
    location: String,
    reviews: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Review'}
    ],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    id: {
    type: Number,
    index: true
    }

}, {toJSON: {virtuals: true}})



campSchema.virtual('geometry').get(function() {
    return this.map;
})

campSchema.virtual('properties').get(function() {
    return {location: this.location, price: this.price}
})

campSchema.virtual('placeholderimg').get(function() {
    return 'https://res.cloudinary.com/dmyr4hycj/image/upload/v1632487320/CampReview/js1czchiuglgjc04wsqt.jpg';
})

const reviewSchema = new mongoose.Schema({
    message: {
    type: String,
    required: true},
    
    rating: Number,
    camp: {type: mongoose.Schema.Types.ObjectId, ref: 'Camp'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

campSchema.post('findOneAndDelete', async(camp)=>{
    
    const deleteReviews = await Review.deleteMany({camp: camp._id});
    camp.image.forEach((x)=> {
        cloudinary.uploader.destroy(x.filename);
    })

    const nextCamps = await Camp.find({id: {$gt: camp.id}})
    
    if (nextCamps && nextCamps.length) {
        
        nextCamps.forEach(async(x)=> {
            x.id -= 1;
            await x.save();
        })
    }
})

campSchema.pre('save', async function() {
    if(!this.id){
        const camps = await Camp.count({});
        const id = camps + 1;
        
        this.id = id;
    }
    
    
})

const Camp = new mongoose.model('Camp', campSchema);

const Review = new mongoose.model('Review', reviewSchema);

module.exports = [Camp, Review];

