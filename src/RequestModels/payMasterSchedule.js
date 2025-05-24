const Joi = require('joi');

function validatePayMasterScheduleRequest(request){
    const payMasterScheduleSchema = Joi.object({
        account: Joi.string().min(2).max(50).required(),
        location: Joi.string().min(2).max(50).required(),
        date: Joi.date().greater('now').required(),
        dayOfTheWeek: Joi.string().lowercase().equal('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday').required(),
        firstName: Joi.string().uppercase().min(3).max(50).required(),
        lastName: Joi.string().uppercase().min(3).max(50).required(),
        employeeID: Joi.number().positive().integer().required(),
        paidTimeOut: Joi.string().regex(new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/)).required(),
        paidTimeIn: Joi.string().regex(new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/)).required(),
        hours: Joi.number().positive().precision(2).required(),
        rate: Joi.number().positive().precision(2).max(99).required(),
        tipsCredited: Joi.number().positive().precision(2).max(99).required(),
        reportedTips: Joi.number().greater(-1).precision(2).max(99),
        wage: Joi.number().positive().precision(2).required(),
        minimumPay: Joi.number().greater(-1).precision(2),
        tips: Joi.number().positive().precision(2).max(99).required(),
        pay: Joi.number().positive().precision(2).required(),
        minimumTip: Joi.number().positive().precision(2).required(),
        totalPay: Joi.number().positive().precision(2).required()
    });
    
    return payMasterScheduleSchema.validate(request);
}

module.exports = validatePayMasterScheduleRequest;