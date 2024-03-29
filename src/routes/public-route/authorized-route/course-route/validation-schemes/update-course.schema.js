const Joi = require('joi');

const updateCourseInfoSchema = Joi.object({
  title: Joi.string()
    .max(100)
    .required(),
  description: Joi.string()
    .max(300)
    .required(),
  generalInformation: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required(),
});

module.exports = {
  updateCourseInfoSchema,
};
