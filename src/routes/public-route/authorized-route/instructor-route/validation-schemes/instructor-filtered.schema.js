const Joi = require('joi');

const instructorFilteredSchema = Joi.object({
  offset: Joi.number()
    .integer()
    .min(0),
  limit: Joi.number()
    .integer()
    .min(0),
  orderBy: Joi.string(),
  orderDirection: Joi.string(),
});

module.exports = {
  instructorFilteredSchema,
};
