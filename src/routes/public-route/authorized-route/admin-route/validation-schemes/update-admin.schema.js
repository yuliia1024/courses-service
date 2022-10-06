const Joi = require('joi');
const {
  PASSWORD_PATTERN,
} = require('../../../../../constants');
const { adminSchema } = require('./admin.schema');

const updateAdminSchema = adminSchema.concat(Joi.object({
  password: Joi.string()
    .regex(PASSWORD_PATTERN),
}));

module.exports = {
  updateAdminSchema,
};
