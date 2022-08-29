const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../db.contract');
const { REGEX, USER_ROLE } = require('../../constants');

class StudentUserModel extends Sequelize.Model {}

module.exports = sequelizeInstance => StudentUserModel.init({
  [DB_CONTRACT.common.id.property]: {
    type: Sequelize.UUID,
    primaryKey: true,
    field: DB_CONTRACT.common.id.column,
  },
  [DB_CONTRACT.studentUser.firstName.property]: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: DB_CONTRACT.studentUser.firstName.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.studentUser.lastName.property]: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: DB_CONTRACT.studentUser.lastName.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.studentUser.email.property]: {
    type: Sequelize.STRING(50),
    allowNull: false,
    uniq: true,
    field: DB_CONTRACT.studentUser.email.column,
    validate: {
      is: REGEX.email,
      notEmpty: true,
    },
  },
  [DB_CONTRACT.studentUser.phone.property]: {
    type: Sequelize.STRING(20),
    allowNull: true,
    field: DB_CONTRACT.studentUser.phone.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.studentUser.role.property]: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: USER_ROLE.student,
    field: DB_CONTRACT.studentUser.role.column,
    validate: {
      is: USER_ROLE.student,
      notEmpty: true,
    },
  },
  [DB_CONTRACT.studentUser.isActive.property]: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: DB_CONTRACT.studentUser.isActive.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.studentUser.isVerified.property]: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: DB_CONTRACT.studentUser.isVerified.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.studentUser.hashPassword.property]: {
    type: Sequelize.TEXT,
    field: DB_CONTRACT.studentUser.hashPassword.column,
    allowNull: false,
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
  modelName: DB_CONTRACT.studentUser.tableName,
  freezeTableName: true,
});
