const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../db/db.contract');
const {
  refreshTokenModel,
  instructorUserModel,
  studentUserModel,
  adminUserModel,
} = require('../db');
const { BadRequestError } = require('../error-handler');
const { checkDataFromDB } = require('../utils');

const createExcludedObjectForDB = (excludedPropertyNames = []) => ({
  attributes: {
    exclude: [
      DB_CONTRACT.common.createdAt.property,
      DB_CONTRACT.common.updatedAt.property,
      DB_CONTRACT.common.createdBy.property,
      DB_CONTRACT.common.updatedBy.property,
      ...excludedPropertyNames,
    ],
  },
});

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

const getActiveInstructorUserById = async id => {
  const result = await instructorUserModel.findByPk(id, {
    raw: true,
    nest: true,
    ...createExcludedObjectForDB([
      DB_CONTRACT.instructorUser.hashPassword.property,
    ]),
  });

  if (result && !result.isActive) {
    throw new BadRequestError('This user is not active');
  }

  return result;
};

// eslint-disable-next-line require-await
const updateInstructorUserById = async (id, dataObject, transaction) => instructorUserModel.update(
  dataObject,
  {
    where: {
      [DB_CONTRACT.common.id.property]: id,
    },
    transaction,
  }
);

// eslint-disable-next-line require-await
const getAllInstructorUsersByOptions = async optionsData => instructorUserModel.findAndCountAll({
  ...optionsData,
  raw: true,
  nest: true,
  ...optionsData.where,
  ...createExcludedObjectForDB([
    DB_CONTRACT.adminUser.hashPassword.property,
  ]),
});

// eslint-disable-next-line require-await
const saveStudentUser = async (data, transaction) => studentUserModel.create(data,
  { transaction });

// eslint-disable-next-line require-await
const getActiveStudentUserById = async id => {
  const result = await studentUserModel.findByPk(id, {
    raw: true,
    nest: true,
    ...createExcludedObjectForDB([
      DB_CONTRACT.studentUser.hashPassword.property,
    ]),
  });

  if (result && !result.isActive) {
    throw new BadRequestError('This user is not active');
  }

  return result;
};

// eslint-disable-next-line require-await
const getStudentUserByOptions = async options => studentUserModel.findOne({
  raw: true,
  nest: true,
  where: {
    ...options,
  },
  ...createExcludedObjectForDB([
    DB_CONTRACT.studentUser.hashPassword.property,
  ]),
});

// eslint-disable-next-line require-await
const getInstructorUserByOptions = async options => instructorUserModel.findOne({
  raw: true,
  nest: true,
  where: {
    ...options,
  },
  ...createExcludedObjectForDB([
    DB_CONTRACT.studentUser.hashPassword.property,
  ]),
});

// eslint-disable-next-line require-await
const updateStudentUserById = async (id, dataObject, transaction) => studentUserModel.update(
  dataObject,
  {
    where: {
      [DB_CONTRACT.common.id.property]: id,
    },
    transaction,
  }
);

// eslint-disable-next-line require-await
const getAllStudentUsersByOptions = async optionsData => studentUserModel.findAndCountAll({
  ...optionsData,
  raw: true,
  nest: true,
  ...optionsData.where,
  ...createExcludedObjectForDB([
    DB_CONTRACT.adminUser.hashPassword.property,
  ]),
});

// eslint-disable-next-line require-await
const getStudentUsersByOptions = async optionsData => studentUserModel.findAll({
  ...optionsData,
  raw: true,
  nest: true,
});

// eslint-disable-next-line require-await
const getStudentUserByEmail = async email => studentUserModel.findOne({
  raw: true,
  nest: true,
  where: {
    email,
    [DB_CONTRACT.studentUser.isActive.property]: true,
  },
  ...createExcludedObjectForDB(),
});

// eslint-disable-next-line require-await
const getAdminUserByEmail = async email => adminUserModel.findOne({
  raw: true,
  nest: true,
  where: {
    email,
    [DB_CONTRACT.adminUser.isActive.property]: true,
  },
  ...createExcludedObjectForDB(),
});

// eslint-disable-next-line require-await
const getInstructorUserByEmail = async email => instructorUserModel.findOne({
  raw: true,
  nest: true,
  where: {
    email,
    [DB_CONTRACT.instructorUser.isActive.property]: true,
  },
  ...createExcludedObjectForDB(),
});

// eslint-disable-next-line require-await
const saveAdminUser = async (data, transaction) => adminUserModel.create(data,
  { transaction });

const getAdminUserById = async id => {
  const result = await adminUserModel.findByPk(id, {
    raw: true,
    nest: true,
    ...createExcludedObjectForDB([
      DB_CONTRACT.adminUser.hashPassword.property,
    ]),
  });

  checkDataFromDB(result);

  return result;
};

// eslint-disable-next-line require-await
const updateAdminUserById = async (id, dataObject, transaction) => adminUserModel.update(
  dataObject,
  {
    where: {
      [DB_CONTRACT.common.id.property]: id,
    },
    transaction,
  }
);

// eslint-disable-next-line require-await
const getAllAdminUsersByOptions = async optionsData => adminUserModel.findAndCountAll({
  ...optionsData,
  raw: true,
  nest: true,
  ...createExcludedObjectForDB([
    DB_CONTRACT.adminUser.hashPassword.property,
  ]),
});

// eslint-disable-next-line require-await
const getAllAdminUsersByQuery = async query => adminUserModel.findAll({
  raw: true,
  nest: true,
  where: {
    ...query,
  },
});

module.exports = {
  saveRefreshToken,
  removeRefreshTokenByUserId,
  removeRefreshTokenByTokens,
  removeRefreshTokensByArrayUsersIds,
  saveInstructorUser,
  saveStudentUser,
  getStudentUserByEmail,
  getAdminUserByEmail,
  getInstructorUserByEmail,
  getActiveInstructorUserById,
  updateInstructorUserById,
  getAllInstructorUsersByOptions,
  getActiveStudentUserById,
  updateStudentUserById,
  getAllStudentUsersByOptions,
  saveAdminUser,
  getAdminUserById,
  updateAdminUserById,
  getAllAdminUsersByOptions,
  getStudentUserByOptions,
  getInstructorUserByOptions,
  getStudentUsersByOptions,
  getAllAdminUsersByQuery,
};
