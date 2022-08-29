const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../db/db.contract');
const { refreshTokenModel, instructorUserModel, studentUserModel } = require('../db');

const saveRefreshToken = async data => {
  await refreshTokenModel.create({
    [DB_CONTRACT.refreshToken.userId.property]: data.userId,
    [DB_CONTRACT.refreshToken.expirationTime.property]: data.exp,
    [DB_CONTRACT.refreshToken.refreshToken.property]: data.refreshToken,
    [DB_CONTRACT.refreshToken.accessToken.property]: data.accessToken,
  });
};

const removeRefreshTokenByUserId = async userId => {
  await refreshTokenModel.destroy({
    where: {
      [DB_CONTRACT.refreshToken.userId.property]: userId,
    },
  });
};

const removeRefreshTokenByTokens = data => refreshTokenModel.destroy({
  where: {
    [DB_CONTRACT.refreshToken.userId.property]: data.userId,
    [DB_CONTRACT.refreshToken.refreshToken.property]: data.refreshToken,
    [DB_CONTRACT.refreshToken.accessToken.property]: data.accessToken,
  },
});

const removeRefreshTokensByArrayUsersIds = async usersIds => {
  await refreshTokenModel.destroy({
    where: {
      [DB_CONTRACT.refreshToken.userId.property]: {
        [Sequelize.Op.or]: usersIds,
      },
    },
  });
};

// eslint-disable-next-line require-await
const saveInstructorUser = async (data, transaction) => instructorUserModel.create(data,
  { transaction });

// eslint-disable-next-line require-await
const saveStudentUser = async (data, transaction) => studentUserModel.create(data,
  { transaction });

module.exports = {
  saveRefreshToken,
  removeRefreshTokenByUserId,
  removeRefreshTokenByTokens,
  removeRefreshTokensByArrayUsersIds,
  saveInstructorUser,
  saveStudentUser,
};
