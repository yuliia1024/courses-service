const { HTTP_STATUS } = require('../../constants');
const { CustomError } = require('../custom.error');

class NotFoundError extends CustomError {
  /**
   * The error class from "CustomError" for "Not Found" request errors
   * @param { String } errMessage - the message of an error
   * @param { Object } metadata - additional data
   */
  constructor(errMessage, metadata = {}) {
    super(
      errMessage,
      metadata,
      HTTP_STATUS.notFound.code,
      HTTP_STATUS.notFound.error,
    );
  }
}

module.exports = {
  NotFoundError,
};
