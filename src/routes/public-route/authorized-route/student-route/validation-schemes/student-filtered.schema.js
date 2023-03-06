const Joi = require('joi');
const { STUDENT_COURSES_STATUS } = require('../../../../../constants');

const studentFilteredSchema = Joi.object({
  offset: Joi.number()
    .integer()
    .min(0),
  limit: Joi.number()
    .integer()
    .min(0),
  orderBy: Joi.string(),
  orderDirection: Joi.string(),
  courseId: Joi.string()
    .uuid(),
  courseStatus: Joi.when('courseId', {
    is: Joi.exist(),
    then: Joi.string()
      .valid(...Object.values(STUDENT_COURSES_STATUS)),
    otherwise: Joi.forbidden(),
  }),
  isActive: Joi.boolean(),
});

module.exports = {
  studentFilteredSchema,
};
