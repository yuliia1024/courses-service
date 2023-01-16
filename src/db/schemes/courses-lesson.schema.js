const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../db.contract');

class CoursesLessonModel extends Sequelize.Model {}

module.exports = sequelizeInstance => CoursesLessonModel.init({
  [DB_CONTRACT.common.id.property]: {
    type: Sequelize.UUID,
    primaryKey: true,
    field: DB_CONTRACT.common.id.column,
  },
  [DB_CONTRACT.coursesLesson.courseId.property]: {
    type: Sequelize.UUID,
    allowNull: false,
    field: DB_CONTRACT.coursesLesson.courseId.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.coursesLesson.title.property]: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: DB_CONTRACT.coursesLesson.title.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.coursesLesson.lessonNumber.property]: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: DB_CONTRACT.coursesLesson.lessonNumber.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.coursesLesson.description.property]: {
    type: Sequelize.STRING(300),
    allowNull: false,
    field: DB_CONTRACT.coursesLesson.description.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.coursesLesson.information.property]: {
    type: Sequelize.JSON(),
    allowNull: false,
    field: DB_CONTRACT.coursesLesson.information.column,
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
  modelName: DB_CONTRACT.coursesLesson.tableName,
  freezeTableName: true,
});
