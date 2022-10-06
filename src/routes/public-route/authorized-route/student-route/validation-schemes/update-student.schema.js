const Joi = require('joi');
const {
  PASSWORD_PATTERN,
} = require('../../../../../constants');
const { studentSchema } = require('./student.schema');

const updateStudentSchema = studentSchema.concat(Joi.object({
  password: Joi.string()
    .regex(PASSWORD_PATTERN),
}));

module.exports = {
  updateStudentSchema,
};
