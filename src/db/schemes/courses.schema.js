const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../db.contract');

class CoursesModel extends Sequelize.Model {}

module.exports = sequelizeInstance => CoursesModel.init({
  [DB_CONTRACT.common.id.property]: {
    type: Sequelize.UUID,
    primaryKey: true,
    field: DB_CONTRACT.common.id.column,
  },
  [DB_CONTRACT.courses.title.property]: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: DB_CONTRACT.courses.title.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.courses.description.property]: {
    type: Sequelize.STRING(300),
    allowNull: false,
    field: DB_CONTRACT.courses.description.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.courses.generalInformation.property]: {
    type: Sequelize.JSON(),
    allowNull: false,
    field: DB_CONTRACT.courses.generalInformation.column,
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
  modelName: DB_CONTRACT.courses.tableName,
  freezeTableName: true,
});
