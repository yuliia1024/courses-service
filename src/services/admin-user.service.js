const generator = require('generate-password');
const { v4: uuid } = require('uuid');
const nodemailer = require('../utils/nodemailer');
const { USER_ROLE } = require('../constants');
const { BadRequestError } = require('../error-handler');
const {
  saveAdminUser,
  updateAdminUserById,
  getAllAdminUsersByOptions,
  getAllAdminUsersByQuery,
} = require('./db.service');
const { DB_CONTRACT } = require('../db/db.contract');
const { sequelizeInstance } = require('../db');
const {
  createCustomError,
  checkDataFromDB,
  createOrderParameters,
} = require('../utils');
const { declineTokensByAdmin } = require('./token.service');
const { hashPassword } = require('../utils/bcrypt');
const { mailerConfig, passwordGeneratorOptions } = require('../../config');
const {
  createPaginateOptions,
  createDataObjectWithPaginationInfo,
} = require('../utils/pagination');

const createAdminUser = async req => {
  const transaction = await sequelizeInstance.transaction();
  const id = uuid();
  const password = generator.generate(passwordGeneratorOptions);

  try {
    const hashedPassword = await hashPassword(password);

    await saveAdminUser({
      ...req.body,
      id,
      [DB_CONTRACT.adminUser.hashPassword.property]: hashedPassword,
      [DB_CONTRACT.adminUser.isActive.property]: true,
      [DB_CONTRACT.common.createdBy.property]: req.userId,
      [DB_CONTRACT.adminUser.role.property]: USER_ROLE.admin,
    }, transaction);

    await nodemailer.sendMail({
      from: mailerConfig.email,
      to: req.body.email,
      subject: 'Courses service: account created',
      text: `Account for this email address has been created. Your password is: ${password}`,
    });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();

    throw createCustomError(err);
  }
};

const updateAdminUser = async (id, loggedInUserId, data) => {
  const dataObject = {
    ...data,
    ...(data.password && { [DB_CONTRACT.adminUser.hashPassword.property]: await hashPassword(data.password) }),
    [DB_CONTRACT.common.updatedBy.property]: loggedInUserId,
  };

  const result = await updateAdminUserById(id, dataObject);

  checkDataFromDB(result[0]);
};

const inactiveAdminUser = async (req, id) => {
  if (!id) {
    throw new BadRequestError('ID is not provided');
  }
  const transaction = await sequelizeInstance.transaction();

  const admins = await getAllAdminUsersByQuery({
    [DB_CONTRACT.adminUser.isActive.property]: true,
  });

  if (admins.length <= 1) {
    throw new BadRequestError('You cannot inactive last admin in the service');
  }

  try {
    await updateAdminUserById(id, {
      [DB_CONTRACT.adminUser.isActive.property]: false,
      [DB_CONTRACT.common.updatedBy.property]: req.userId,
    }, transaction);

    await declineTokensByAdmin(id);

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();

    throw createCustomError(err);
  }
};

const getAllAdminsUser = async data => {
  try {
    const {
      offset,
      limit,
      orderBy,
      orderDirection,
    } = data;

    const order = createOrderParameters(orderBy, orderDirection);

    const options = createPaginateOptions(offset, limit, order);

    const {
      count,
      rows,
    } = await getAllAdminUsersByOptions(options);

    return createDataObjectWithPaginationInfo(offset, limit, count, rows);
  } catch (err) {
    throw createCustomError(err);
  }
};

module.exports = {
  createAdminUser,
  updateAdminUser,
  inactiveAdminUser,
  getAllAdminsUser,
};
