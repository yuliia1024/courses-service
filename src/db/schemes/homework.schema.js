const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../db.contract');

class HomeworkModel extends Sequelize.Model {}

module.exports = sequelizeInstance => HomeworkModel.init({
  [DB_CONTRACT.common.id.property]: {
    type: Sequelize.UUID,
    primaryKey: true,
    field: DB_CONTRACT.common.id.column,
  },
  [DB_CONTRACT.homework.filePath.property]: {
    type: Sequelize.STRING(300),
    allowNull: false,
    field: DB_CONTRACT.homework.filePath.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.homework.studentId.property]: {
    type: Sequelize.UUID,
    allowNull: false,
    field: DB_CONTRACT.homework.studentId.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.homework.courseLessonId.property]: {
    type: Sequelize.UUID,
    allowNull: false,
    field: DB_CONTRACT.homework.courseLessonId.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.homework.mark.property]: {
    type: Sequelize.INTEGER,
    allowNull: true,
    field: DB_CONTRACT.homework.mark.column,
    validate: {
      max: 100,
      min: 1,
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
  modelName: DB_CONTRACT.homework.tableName,
  freezeTableName: true,
  indexes: [
    {
      name: DB_CONTRACT.homework.compositeIndexName,
      unique: true,
      fields: [
        DB_CONTRACT.homework.courseLessonId.column,
        DB_CONTRACT.homework.studentId.column,
      ],
    },
  ],
});
