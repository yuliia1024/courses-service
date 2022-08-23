const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../db.contract');
const { REGEX, USER_ROLE } = require('../../src/constants');

class InstructorUserModel extends Sequelize.Model {}

module.exports = sequelizeInstance => InstructorUserModel.init({
  [DB_CONTRACT.common.id.property]: {
    type: Sequelize.UUID,
    primaryKey: true,
    field: DB_CONTRACT.common.id.column,
  },
  [DB_CONTRACT.instructorUser.firstName.property]: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: DB_CONTRACT.instructorUser.firstName.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.instructorUser.lastName.property]: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: DB_CONTRACT.instructorUser.lastName.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.instructorUser.email.property]: {
    type: Sequelize.STRING(50),
    allowNull: false,
    uniq: true,
    field: DB_CONTRACT.instructorUser.email.column,
    validate: {
      is: REGEX.email,
      notEmpty: true,
    },
  },
  [DB_CONTRACT.instructorUser.role.property]: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: USER_ROLE.admin,
    field: DB_CONTRACT.instructorUser.role.column,
    validate: {
      is: USER_ROLE.admin,
      notEmpty: true,
    },
  },
  [DB_CONTRACT.instructorUser.isActive.property]: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: DB_CONTRACT.instructorUser.isActive.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.instructorUser.hashPassword.property]: {
    type: Sequelize.TEXT,
    field: DB_CONTRACT.instructorUser.hashPassword.column,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.instructorUser.generalInformation.property]: {
    type: Sequelize.JSON,
    allowNull: false,
    field: DB_CONTRACT.instructorUser.generalInformation.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.instructorUser.academicStatus.property]: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: DB_CONTRACT.instructorUser.academicStatus.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.common.createdBy.property]: {
    type: Sequelize.UUID,
    allowNull: true,
    field: DB_CONTRACT.common.createdBy.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.common.updatedBy.property]: {
    type: Sequelize.UUID,
    allowNull: true,
    field: DB_CONTRACT.common.updatedBy.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.common.createdAt.property]: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: DB_CONTRACT.common.createdAt.column,
    validate: {
      isDate: true,
    },
  },
  [DB_CONTRACT.common.updatedAt.property]: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: DB_CONTRACT.common.updatedAt.column,
    validate: {
      isDate: true,
    },
  },
}, {
  sequelize: sequelizeInstance,
  modelName: DB_CONTRACT.instructorUser.tableName,
  freezeTableName: true,
});
