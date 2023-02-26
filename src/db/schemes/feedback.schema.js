const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../db.contract');

class FeedbackModel extends Sequelize.Model {}

module.exports = sequelizeInstance => FeedbackModel.init({
  [DB_CONTRACT.common.id.property]: {
    type: Sequelize.UUID,
    primaryKey: true,
    field: DB_CONTRACT.common.id.column,
  },
  [DB_CONTRACT.studentFeedback.studentId.property]: {
    type: Sequelize.UUID,
    allowNull: false,
    field: DB_CONTRACT.studentFeedback.studentId.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.studentFeedback.courseId.property]: {
    type: Sequelize.UUID,
    allowNull: false,
    field: DB_CONTRACT.studentFeedback.courseId.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.studentFeedback.feedback.property]: {
    type: Sequelize.STRING(300),
    allowNull: true,
    field: DB_CONTRACT.studentFeedback.feedback.column,
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
  modelName: DB_CONTRACT.studentFeedback.tableName,
  freezeTableName: true,
  indexes: [
    {
      name: DB_CONTRACT.studentFeedback.compositeIndexName,
      unique: true,
      fields: [
        DB_CONTRACT.studentFeedback.courseId.column,
        DB_CONTRACT.studentFeedback.studentId.column,
      ],
    },
  ],
});
