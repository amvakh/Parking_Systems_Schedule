const Joi = require('joi');

function validateLoginRequest(request){
    const loginSchema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(3).max(50).required()
    });
    
    return loginSchema.validate(request);
}

module.exports = validateLoginRequest;