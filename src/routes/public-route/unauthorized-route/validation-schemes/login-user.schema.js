const Joi = require('joi');
const { EMAIL_PATTERN, PASSWORD_PATTERN } = require('../../../../constants');

const loginUserSchema = Joi.object({
  email: Joi.string()
    .regex(EMAIL_PATTERN)
    .required(),
  password: Joi.string()
    .regex(PASSWORD_PATTERN)
    .required(),
});

module.exports = {
  loginUserSchema,
};
