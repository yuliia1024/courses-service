const { HTTP_STATUS } = require('../../constants');
const { CustomError } = require('../custom.error');

class BadRequestError extends CustomError {
  /**
   * The error class from "CustomError" for "Bad Request" request errors
   * @param { String } errMessage - the message of an error
   * @param { Object } metadata - additional data
   */
  constructor(errMessage, metadata = {}) {
    super(
      errMessage,
      metadata,
      HTTP_STATUS.badRequest.code,
      HTTP_STATUS.badRequest.error,
    );
  }
}

module.exports = {
  BadRequestError,
};
