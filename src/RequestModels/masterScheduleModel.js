const Joi = require('joi');

function validateMasterScheduleRequest(request){
    const masterScheduleSchema = Joi.object({
        account: Joi.string().min(2).max(50).required(),
        location: Joi.string().min(2).max(50).required(),
        date: Joi.date().greater('now').required(),
        dayOfTheWeek: Joi.string().lowercase().equal('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday').required(),
        firstName: Joi.string().uppercase().min(3).max(50).required(),
        lastName: Joi.string().uppercase().min(3).max(50).required(),
        employeeID: Joi.number().positive().integer().required(),
        paidTimeOut: Joi.string().regex(new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/)).required(),
        paidTimeIn: Joi.string().regex(new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/)).required(),
        dinnerLunchBreak: Joi.number().greater(-1).precision(2),
        hours: Joi.number().positive().precision(2)
    });
    
    return masterScheduleSchema.validate(request);
}

module.exports = validateMasterScheduleRequest;