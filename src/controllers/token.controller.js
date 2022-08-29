const { getAccessTokenFromHeader } = require('../utils');
const {
  generateTokens,
  decodeToken,
  verifyToken,
  checkAndRemoveRefreshToken,
  declineTokens,
} = require('../services/token.service');
const { SuccessResponse } = require('../custom-response');

const refreshTokenController = async (req, res) => {
  const { refreshToken } = req.body;
  const accessToken = getAccessTokenFromHeader(req);

  await checkAndRemoveRefreshToken(accessToken, refreshToken);

  verifyToken(refreshToken);

  const tokens = await generateTokens(req, decodeToken(accessToken));

  new SuccessResponse(res).send(tokens);
};

const declineTokenController = async (req, res) => {
  await declineTokens(req);

  new SuccessResponse(res).send();
};

module.exports = {
  refreshTokenController,
  declineTokenController,
};
