const { HTTP_STATUS } = require('../../constants');
const { CustomError } = require('../custom.error');

class ValidationError extends CustomError {
  /**
   * The error class from "CustomError" for any validation errors of request data
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
  ValidationError,
};
