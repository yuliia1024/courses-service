const { get } = require('lodash');
const { ValidationError, UnauthorizedError } = require('../error-handler');
const { USER_ROLE } = require('../constants');
const { createCustomError, getAccessTokenFromHeader } = require('../utils');
const { verifyAccessToken } = require('../services/token.service');

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
      next(new ValidationError(`The param ${item} is required in header`), {
        metaData: { item },
      });

      return;
    }
  }

  next();
};

const verifyToken = () => async (req, res, next) => {
  const userRoles = Object.values(USER_ROLE);

  try {
    const accessTokenFromHeader = getAccessTokenFromHeader(req);

    const result = await verifyAccessToken(accessTokenFromHeader);

    req.userId = get(result, 'userId');
    req.userRole = get(result, 'role');

    if (!userRoles.includes(req.userRole)) {
      throw new UnauthorizedError('User role is incorrect!');
    }

    next();
  } catch (err) {
    next(createCustomError(err));
  }
};

module.exports = {
  validateValues,
  validateHeaderFields,
  verifyToken,
};
