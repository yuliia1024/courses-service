const { HTTP_STATUS } = require('../../constants');
const { CustomError } = require('../custom.error');

class UnauthorizedError extends CustomError {
  /**
   * The error class from "CustomError" for "Unauthorized" request errors
   * @param { String } errMessage - the message of an error
   * @param { Object } metadata - additional data
   */
  constructor(errMessage, metadata = {}) {
    super(
      errMessage,
      metadata,
      HTTP_STATUS.unauthorized.code,
      HTTP_STATUS.unauthorized.error,
    );
  }
}

module.exports = {
  UnauthorizedError,
};
