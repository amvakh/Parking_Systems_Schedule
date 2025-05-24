const Joi = require('joi');

function validateRegisterRequest(request){
    const registerSchema = Joi.object({
        id: Joi.number().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        isManager: Joi.boolean().required()
    });
    
    return registerSchema.validate(request);
}

module.exports = validateRegisterRequest;