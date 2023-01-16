const Joi = require('joi');

const createLessonSchema = Joi.object({
  title: Joi.string()
    .max(100)
    .required(),
  description: Joi.string()
    .max(300)
    .required(),
  information: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required(),
});

module.exports = {
  createLessonSchema,
};
