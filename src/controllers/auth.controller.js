const { SuccessResponse } = require('../custom-response');

const testController = (req, res) => {
  new SuccessResponse(res).send();
};

module.exports = {
  testController,
};
