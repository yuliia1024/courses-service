const { HTTP_STATUS } = require('../../constants');
const { CustomError } = require('../custom.error');

class ForbiddenError extends CustomError {
  /**
   * The error class from "CustomError" for "Forbidden" request errors
   * @param { String } errMessage - the message of an error
   * @param { Object } metadata - additional data
   */
  constructor(errMessage, metadata = {}) {
    super(
      errMessage,
      metadata,
      HTTP_STATUS.forbidden.code,
      HTTP_STATUS.forbidden.error,
    );
  }
}

module.exports = {
  ForbiddenError,
};
