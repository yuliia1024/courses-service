const Joi = require('joi');

const homeworkMarkSchema = Joi.object({
  mark: Joi.number()
    .positive()
    .integer()
    .max(100)
    .min(0)
    .required(),
  courseLessonId: Joi.string()
    .uuid()
    .required(),
  studentId: Joi.string()
    .uuid()
    .required(),
});

module.exports = {
  homeworkMarkSchema,
};
