const Joi = require('joi');
const {
  EMAIL_PATTERN,
} = require('../../../../../constants');

const studentSchema = Joi.object({
  firstName: Joi.string()
    .max(100)
    .required(),
  lastName: Joi.string()
    .max(100)
    .required(),
  email: Joi.string()
    .regex(EMAIL_PATTERN)
    .required(),
  phone: Joi.string()
    .max(20)
    .allow(null),
});

module.exports = {
  studentSchema,
};
