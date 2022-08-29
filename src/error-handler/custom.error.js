const { get, omit } = require('lodash');
const { HTTP_STATUS } = require('../constants');

class CustomError extends Error {
  /**
   * The common class for the processed errors
   * @param { String } message - the message of an error
   * @param { Object } metadata - the additional data that will be added to a response
   * @param { Number } code - http status code
   * @param { String } httpError - the text of http status code (e.g. Not Found, Forbidden, Bad Request)
   */
  constructor(
    message,
    metadata = {},
    code = HTTP_STATUS.internalServerError.code,
    httpError = HTTP_STATUS.internalServerError.error,
  ) {
    super();
    this.code = code;
    this.httpError = httpError;
    this.metadata = omit(metadata, 'originalMessage');
    this.originalMessage = get(metadata, 'originalMessage');

    // do not change this "IF" because "this.message" is an Error object's property
    if (message) this.message = message;
  }

  /**
   * Create a response with the default structure
   * @param { String } message - the message of an error
   * @returns {{success: Boolean, error: Object}}
   */
  createResponse(message = null) {
    return {
      success: false,
      error: {
        ...this.metadata,
        code: this.code,
        error: this.httpError,
        message: message || this.message,
      },
    };
  }
}

module.exports = {
  CustomError,
};
