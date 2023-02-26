const Joi = require('joi');

const homeworkCreateSchema = Joi.object({
  studentId: Joi.string()
    .uuid()
    .required(),
  lessonId: Joi.string()
    .uuid()
    .required(),
});

module.exports = {
  homeworkCreateSchema,
};
