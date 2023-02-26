const Joi = require('joi');

const getStudentFeedbackSchema = Joi.object({
  courseId: Joi.string()
    .uuid(),
  studentId: Joi.string()
    .uuid()
    .required(),
});

module.exports = {
  getStudentFeedbackSchema,
};
