const { SuccessResponse } = require('../custom-response');

const testController = async (req, res) => {
  new SuccessResponse(res).send();
};

module.exports = {
  testController,
};
