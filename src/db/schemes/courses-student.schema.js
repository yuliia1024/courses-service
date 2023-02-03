const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../db.contract');
const { STUDENT_COURSES_STATUS } = require('../../constants');

class CoursesStudentModel extends Sequelize.Model {}

module.exports = sequelizeInstance => CoursesStudentModel.init({
  [DB_CONTRACT.common.id.property]: {
    type: Sequelize.UUID,
    primaryKey: true,
    field: DB_CONTRACT.common.id.column,
  },
  [DB_CONTRACT.coursesStudent.courseId.property]: {
    type: Sequelize.UUID,
    allowNull: false,
    field: DB_CONTRACT.coursesStudent.courseId.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.coursesStudent.studentId.property]: {
    type: Sequelize.UUID,
    allowNull: false,
    field: DB_CONTRACT.coursesStudent.studentId.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.coursesStudent.status.property]: {
    type: Sequelize.STRING(20),
    allowNull: false,
    field: DB_CONTRACT.coursesStudent.status.column,
    validate: {
      is: Object.values(STUDENT_COURSES_STATUS),
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
  modelName: DB_CONTRACT.coursesStudent.tableName,
  freezeTableName: true,
  indexes: [
    {
      name: DB_CONTRACT.coursesStudent.compositeIndexName,
      unique: true,
      fields: [
        DB_CONTRACT.coursesStudent.courseId.column,
        DB_CONTRACT.coursesStudent.studentId.column,
      ],
    },
  ],
});
