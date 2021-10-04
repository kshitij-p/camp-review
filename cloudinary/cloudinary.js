const cloudinary = require('cloudinary').v2
const {CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'CampReview',
    
        allowedFormats: ["jpeg", "png", "bmp", "jpg"],
        width: 625,
        height: 425
    }
    
})

module.exports = {cloudinary, storage};