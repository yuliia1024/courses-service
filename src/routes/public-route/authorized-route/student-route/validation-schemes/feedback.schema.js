const Joi = require('joi');

const studentFeedbackSchema = Joi.object({
  courseId: Joi.string()
    .uuid()
    .required(),
  studentId: Joi.string()
    .uuid()
    .required(),
  feedback: Joi.string()
    .required(),
});

module.exports = {
  studentFeedbackSchema,
};
