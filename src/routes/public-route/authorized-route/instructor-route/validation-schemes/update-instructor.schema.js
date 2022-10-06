const Joi = require('joi');
const {
  PASSWORD_PATTERN,
} = require('../../../../../constants');
const { instructorSchema } = require('./instructor.schema');

const updateInstructorSchema = instructorSchema.concat(Joi.object({
  password: Joi.string()
    .regex(PASSWORD_PATTERN),
}));

module.exports = {
  updateInstructorSchema,
};
