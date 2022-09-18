const { v4: uuid } = require('uuid');
const { omit } = require('lodash');
const { sequelizeInstance } = require('../db');
const { createCustomError } = require('../utils');
const { USER_ROLE } = require('../constants');
const {
  saveInstructorUser,
  saveStudentUser,
  getStudentUserByEmail,
  getInstructorUserByEmail,
  getAdminUserByEmail,
} = require('./db.service');
const { DB_CONTRACT } = require('../db/db.contract');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { UnauthorizedError } = require('../error-handler');

const registrationUser = async userData => {
  const transaction = await sequelizeInstance.transaction();
  const id = uuid();
  const hashPasswordDB = await hashPassword(userData.password);

  try {
    if (userData.role === USER_ROLE.instructor) {
      await saveInstructorUser(
        {
          ...userData,
          [DB_CONTRACT.instructorUser.hashPassword.property]: hashPasswordDB,
          [DB_CONTRACT.instructorUser.isActive.property]: true,
          [DB_CONTRACT.common.createdBy.property]: id,
          [DB_CONTRACT.common.updatedBy.property]: id,
          id,
        },
        transaction,
      );
    } else if (userData.role === USER_ROLE.student) {
      await saveStudentUser(
        {
          ...userData,
          [DB_CONTRACT.studentUser.hashPassword.property]: hashPasswordDB,
          [DB_CONTRACT.studentUser.isActive.property]: true,
          [DB_CONTRACT.common.createdBy.property]: id,
          [DB_CONTRACT.common.updatedBy.property]: id,
          id,
        },
        transaction,
      );
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();

    throw createCustomError(err);
  }
};

const loginUser = async credentials => {
  try {
    let user = await getStudentUserByEmail(credentials.email);

    if (!user) {
      user = await getInstructorUserByEmail(credentials.email);
    }
    if (!user) {
      user = await getAdminUserByEmail(credentials.email);
    }
    if (!user) {
      throw new UnauthorizedError('Email or password is incorrect.');
    }

    const match = await comparePassword(credentials.password, user.hashPassword);

    if (!match) {
      throw new UnauthorizedError('Email or password is incorrect.');
    }

    return omit(user, ['hashPassword']);
  } catch (err) {
    throw createCustomError(err);
  }
};

module.exports = {
  registrationUser,
  loginUser,
};
