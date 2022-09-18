const Joi = require('joi');
const {
  EMAIL_PATTERN,
} = require('../../../../../constants');

const adminSchema = Joi.object({
  firstName: Joi.string()
    .max(100)
    .required(),
  lastName: Joi.string()
    .max(100)
    .required(),
  email: Joi.string()
    .regex(EMAIL_PATTERN)
    .required(),
});

module.exports = {
  adminSchema,
};
