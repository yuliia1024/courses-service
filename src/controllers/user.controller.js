const { SuccessResponse } = require('../custom-response');
const { registrationUser } = require('../services/user.service');

const registrationUserController = async (req, res) => {
  await registrationUser(req.body);

  new SuccessResponse(res).send();
};

module.exports = {
  registrationUserController,
};
