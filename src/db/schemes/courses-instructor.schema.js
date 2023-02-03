const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../db.contract');

class CoursesInstructorModel extends Sequelize.Model {}

module.exports = sequelizeInstance => CoursesInstructorModel.init({
  [DB_CONTRACT.common.id.property]: {
    type: Sequelize.UUID,
    primaryKey: true,
    field: DB_CONTRACT.common.id.column,
  },
  [DB_CONTRACT.coursesInstructor.courseId.property]: {
    type: Sequelize.UUID,
    allowNull: false,
    field: DB_CONTRACT.coursesInstructor.courseId.column,
    validate: {
      notEmpty: true,
    },
  },
  [DB_CONTRACT.coursesInstructor.instructorId.property]: {
    type: Sequelize.UUID,
    allowNull: false,
    field: DB_CONTRACT.coursesInstructor.instructorId.column,
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
  modelName: DB_CONTRACT.coursesInstructor.tableName,
  freezeTableName: true,
  indexes: [
    {
      name: DB_CONTRACT.coursesInstructor.compositeIndexName,
      unique: true,
      fields: [
        DB_CONTRACT.coursesInstructor.courseId.column,
        DB_CONTRACT.coursesInstructor.instructorId.column,
      ],
    },
  ],
});
