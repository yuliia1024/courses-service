const { SuccessResponse } = require('../custom-response');
const { registrationUser, loginUser } = require('../services/auth.service');
const { generateTokens } = require('../services/token.service');

const registrationUserController = async (req, res) => {
  await registrationUser(req.body);

  new SuccessResponse(res).send();
};

const loginUserController = async (req, res) => {
  const user = await loginUser(req.body);

  const tokens = await generateTokens({
    userId: user.id,
    role: user.role,
  });

  new SuccessResponse(res).send({
    user,
    tokens,
  });
};

module.exports = {
  registrationUserController,
  loginUserController,
};
