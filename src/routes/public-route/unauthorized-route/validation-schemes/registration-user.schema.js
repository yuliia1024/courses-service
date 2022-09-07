const Joi = require('joi');
const { EMAIL_PATTERN, PASSWORD_PATTERN, USER_ROLE } = require('../../../../constants');

const registrationUserSchema = Joi.object({
  role: Joi.string()
    .valid(USER_ROLE.student, USER_ROLE.instructor)
    .required(),
  firstName: Joi.string()
    .max(100)
    .required(),
  lastName: Joi.string()
    .max(100)
    .required(),
  email: Joi.string()
    .regex(EMAIL_PATTERN)
    .required(),
  password: Joi.string()
    .regex(PASSWORD_PATTERN)
    .required(),
});

module.exports = {
  registrationUserSchema,
};
