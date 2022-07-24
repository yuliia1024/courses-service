const { omit } = require('lodash');
const { CustomError } = require('./custom.error');
const { HTTP_STATUS } = require('../constants');
const { ForbiddenError } = require('./errors/forbidden.error');
const { UnauthorizedError } = require('./errors/unauthorized.error');
const { BadRequestError } = require('./errors/bad-request.error');
const { ValidationError } = require('./errors/validation.error');
const { NotFoundError } = require('./errors/not-found.error');
/**
 * The errors handler of processed errors
 * @param { Request } req - request object from the Express instance
 * @param { Response } res - response object from the Express instance
 * @param { CustomError | Error } errObject - the object from CustomError or "new Error()"
 */
const errorHandler = (req, res, errObject) => {
  const logMetadata = {
    endpoint: req.path,
  };

  if (errObject.code) logMetadata.httpCode = errObject.code;
  if (errObject.httpError) logMetadata.httpError = errObject.httpError;

  if (errObject instanceof CustomError) {
    // eslint-disable-next-line no-param-reassign
    console.log(
      errObject.message,
      logMetadata,
    );

    res.status(errObject.code).send(errObject.createResponse());

    return;
  }

  logMetadata.stack = errObject.stack && errObject.stack.toString();

  const responseMetadata = {
    stack: logMetadata.stack,
    // TODO add:
    // origin: serviceName,
  };

  console.error(
    errObject.message,
    logMetadata,
  );

  if (process.env.NODE_ENV === 'production') {
    res.status(HTTP_STATUS.internalServerError.code).send(
      new CustomError(
        errObject.message,
        omit(responseMetadata, 'stack'),
        HTTP_STATUS.internalServerError.code,
        HTTP_STATUS.internalServerError.error,
      ).createResponse()
    );
  } else {
    res.status(HTTP_STATUS.internalServerError.code).send(
      new CustomError(
        errObject.message,
        responseMetadata,
        HTTP_STATUS.internalServerError.code,
        HTTP_STATUS.internalServerError.error,
      ).createResponse()
    );
  }
};

module.exports = {
  errorHandler,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  CustomError,
};
