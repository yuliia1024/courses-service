const { ValidationError } = require('../error-handler');

const validateValues = (schema, reqDataSource) => (req, res, next) => {
  const { error } = schema.validate(req[reqDataSource]);

  if (error) {
    next(new ValidationError(error.message));

    return;
  }

  next();
};

const validateHeaderFields = (headerFields = []) => (req, res, next) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of headerFields) {
    if (!req.get(item)) {
      next(new ValidationError('The param {{item}} is required in header'), {
        metaData: { item },
      });

      return;
    }
  }

  next();
};

module.exports = {
  validateValues,
  validateHeaderFields,
};
