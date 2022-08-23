const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../db.contract');

class RefreshTokenModel extends Sequelize.Model {}

module.exports = sequelizeInstance => RefreshTokenModel.init({
  [DB_CONTRACT.refreshToken.userId.property]: {
    type: Sequelize.UUID,
    primaryKey: true,
    field: DB_CONTRACT.refreshToken.userId.column,
  },
  [DB_CONTRACT.refreshToken.expirationTime.property]: {
    type: Sequelize.INTEGER(15),
    field: DB_CONTRACT.refreshToken.expirationTime.column,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.refreshToken.accessToken.property]: {
    type: Sequelize.TEXT,
    field: DB_CONTRACT.refreshToken.accessToken.column,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.refreshToken.refreshToken.property]: {
    type: Sequelize.TEXT,
    field: DB_CONTRACT.refreshToken.refreshToken.column,
    allowNull: false,
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
  modelName: DB_CONTRACT.refreshToken.tableName,
  freezeTableName: true,
});
