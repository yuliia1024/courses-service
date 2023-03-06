const Joi = require('joi');

const homeworkOptionsSchema = Joi.object({
  studentId: Joi.string()
    .uuid(),
  courseLessonId: Joi.string()
    .uuid(),
  mark: Joi.boolean(),
});

module.exports = {
  homeworkOptionsSchema,
};
