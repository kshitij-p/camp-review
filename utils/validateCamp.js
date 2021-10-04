const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html'); 

const CustomError = require('./CustomError');

const cleanHTML = (root)=> ({
    type: 'string',
    base: root.string(),
    messages:  {
        'string.cleanHTML': '{{#label}} must not include HTML'
    },
    rules: {
        cleanHTML: {
            validate(value, helpers){
                const clean = sanitizeHtml(value, {allowedTags: [], allowedAttributes: {}})
                if (clean !== value) return helpers.error('string.cleanHTML', {value})
                return clean;
            }
            
        }
    }


})

const Joi = BaseJoi.extend(cleanHTML);


const campSchema = Joi.object({
    name: Joi.string().required().cleanHTML(), 
    location: Joi.string().required().cleanHTML(),
    /* image: Joi.string().required(), */
    description: Joi.string().required().cleanHTML(),
    price: Joi.number().min(0).required(),
    addImage: Joi.any(),
    deleteImages: Joi.array(),
})

const validateCamp = async function (req, res, next) {
    const {name, location, image, description, price} = req.body;
    
    try {
        const {error} = await campSchema.validate(req.body);
        if(error) {
            const msg = error.details.map(e => e.message).join(',');
            
            throw new CustomError(400, msg);
        } else {
            next();
        }
    } catch (e) {
        next(e)
    }
    
}

module.exports = validateCamp;