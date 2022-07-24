const { HTTP_STATUS } = require('../constants');

class SuccessResponse {
  /**
   * The success response class to send success response
   * @param { Response } res - response object from Express
   */
  constructor(res) {
    this.res = res;
  }

  /**
   * Send response with data and status code
   * @param { any } [data] - data that will be sent in the body response
   * @param { Number } [code] - the http status code
   */
  send(data = null, code = HTTP_STATUS.ok.code) {
    this.res.status(code).send({
      success: true,
      ...(data && { result: data }),
    });
  }
}

module.exports = {
  SuccessResponse,
};
