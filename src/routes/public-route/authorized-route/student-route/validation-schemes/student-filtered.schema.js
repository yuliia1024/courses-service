const Joi = require('joi');

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
  isActive: Joi.boolean(),
});

module.exports = {
  studentFilteredSchema,
};
