const Joi = require('joi');

const homeworkOptionsSchema = Joi.object({
  studentId: Joi.string()
    .uuid(),
  lessonId: Joi.string()
    .uuid(),
  mark: Joi.boolean(),
});

module.exports = {
  homeworkOptionsSchema,
};
