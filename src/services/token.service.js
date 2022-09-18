const { cloneDeep } = require('lodash');
const jwt = require('jsonwebtoken');
const { tokenConfig } = require('../../config');
const {
  TOKEN_TYPES,
} = require('../constants');
const { redisClient } = require('./redis.service');
const { getAccessTokenFromHeader, createCustomError } = require('../utils');
const {
  saveRefreshToken,
  removeRefreshTokenByUserId,
  removeRefreshTokenByTokens,
  removeRefreshTokensByArrayUsersIds,
} = require('./db.service');
const { BadRequestError } = require('../error-handler');

const createToken = (payload, options = {}) => jwt.sign(payload, tokenConfig.secretKey, options);

const verifyUserToken = token => jwt.verify(token, tokenConfig.secretKey);

const decodeToken = token => jwt.decode(token);

const generateTokens = async data => {
  const tokenPayload = cloneDeep(data);
  const { userId } = tokenPayload;

  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  delete tokenPayload.iat;
  delete tokenPayload.exp;

  const accessToken = createToken(
    {
      ...tokenPayload,
      type: TOKEN_TYPES.access,
    },
    {
      expiresIn: tokenConfig.expireAccessToken,
    },
  );

  await redisClient.setex(userId, tokenConfig.expireAccessToken, accessToken);

  const refreshToken = createToken(
    {
      ...tokenPayload,
      type: TOKEN_TYPES.refresh,
    },
    {
      expiresIn: tokenConfig.expireRefreshToken,
    },
  );
  const { exp } = decodeToken(refreshToken);

  await removeRefreshTokenByUserId(userId);

  await saveRefreshToken({
    userId,
    exp,
    accessToken,
    refreshToken,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const verifyAccessToken = async accessTokenFromHeader => {
  const { userId, type } = decodeToken(accessTokenFromHeader);

  if (type !== TOKEN_TYPES.access) {
    throw new Error('Access token is incorrect');
  }

  const accessToken = await redisClient.get(userId);

  if (!accessToken || accessToken !== accessTokenFromHeader) {
    throw new Error('jwt expired');
  }

  return verifyUserToken(accessToken);
};

const checkAndRemoveRefreshToken = async (accessToken, refreshToken) => {
  try {
    const { userId } = decodeToken(refreshToken);

    const result = await removeRefreshTokenByTokens({
      accessToken,
      refreshToken,
      userId,
    });

    if (!result) {
      throw new BadRequestError('Refresh token is incorrect');
    }
  } catch (err) {
    throw createCustomError(err);
  }
};

const declineTokens = async req => {
  const { userId } = decodeToken(getAccessTokenFromHeader(req));

  await removeRefreshTokenByUserId(userId);
  await redisClient.del(userId);
};

const declineTokensByAdmin = async userId => {
  await removeRefreshTokenByUserId(userId);
  await redisClient.del(userId);
};

const declineTokenByIds = async usersIds => {
  await removeRefreshTokensByArrayUsersIds(usersIds);

  // we can't use multi-key operations
  // eslint-disable-next-line no-restricted-syntax
  for (const id of usersIds) {
    // eslint-disable-next-line no-await-in-loop
    await redisClient.del(id);
  }
};

module.exports = {
  generateTokens,
  verifyUserToken,
  decodeToken,
  verifyAccessToken,
  checkAndRemoveRefreshToken,
  declineTokens,
  declineTokensByAdmin,
  declineTokenByIds,
};
