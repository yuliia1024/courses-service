const Joi = require('joi');
const {
  EMAIL_PATTERN,
} = require('../../../../../constants');

const instructorSchema = Joi.object({
  firstName: Joi.string()
    .max(100)
    .required(),
  lastName: Joi.string()
    .max(100)
    .required(),
  email: Joi.string()
    .regex(EMAIL_PATTERN)
    .required(),
  academicStatus: Joi.string()
    .max(100),
  generalInformation: Joi.array()
    .items(Joi.string())
    .min(1),
});

module.exports = {
  instructorSchema,
};
