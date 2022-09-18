const { get, cloneDeep, isArray } = require('lodash');
const { HEADER_PARAMS, REGEX, HTTP_STATUS } = require('../constants');
const {
  CustomError,
  BadRequestError,
  NotFoundError,
} = require('../error-handler');

const createCustomError = (err, customErrMessage = null) => {
  if (err instanceof CustomError) {
    return err;
  }

  const errMessage = get(err, 'response.data.error.message') // the error from http requests
    || get(err, 'errors[0].message') // the error from DB
    || get(err, 'message'); // the error from Error object

  // DB error of duplicate entry value of some column
  if (get(err, 'original.errno') === 1062) {
    // eslint-disable-next-line no-param-reassign
    customErrMessage = errMessage;
  }

  return new CustomError(
    customErrMessage || errMessage,
    {
      ...get(err, 'response.data.error'),
      originalMessage: errMessage,
    },
    get(err, 'response.status') || HTTP_STATUS.badRequest.code,
    get(err, 'response.statusText') || HTTP_STATUS.badRequest.error,
  );
};

const createHeader = header => {
  const requestHeader = cloneDeep(header);

  delete requestHeader[HEADER_PARAMS.contentType];
  delete requestHeader[HEADER_PARAMS.contentLength];

  return requestHeader;
};

const getAccessTokenFromHeader = req => {
  const authorizationToken = req.get(HEADER_PARAMS.authorization);
  const [, token] = REGEX.token.exec(authorizationToken) || [];

  if (!token) throw new BadRequestError('Token is incorrect');

  return token;
};

const parseBoolean = variable => {
  if ((variable || '').toLowerCase() === 'true') return true;
  if ((variable || '').toLowerCase() === 'false') return false;

  throw new Error(`The variable "${variable}" is not boolean`);
};

const checkDataFromDB = data => {
  if (
    !data
    || (isArray(data) && !data.length)
  ) {
    throw new NotFoundError('Data not found');
  }
};

const createOrderParameters = (orderBy, orderDirection) => {
  const order = [];

  // add the order parameters to the order
  if (orderBy && orderDirection) {
    order.push([orderBy, orderDirection]);
  }

  return order;
};

module.exports = {
  createCustomError,
  createHeader,
  getAccessTokenFromHeader,
  parseBoolean,
  checkDataFromDB,
  createOrderParameters,
};
