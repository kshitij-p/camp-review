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

const reviewSchema = Joi.object({
    message: Joi.string().min(3).required().cleanHTML(),
    rating: Joi.number().min(1).max(5).required()

})

const validateReview = async function (req, res, next) {
    const {review} = req.body;

    try {
        
        const {error} = await reviewSchema.validate(review);
        
        if (error){
            const msg = error.details.map(e => e.message).join(',');
            throw new CustomError(400, msg);
        }
        else next();
        
    } catch(e) {
        next(e);
    }
}

module.exports = validateReview;