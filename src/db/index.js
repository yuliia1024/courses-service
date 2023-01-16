const Sequelize = require('sequelize');
const { db } = require('../../config');
const refreshTokenInstance = require('./schemes/refresh-token.schema');
const adminUserInstance = require('./schemes/admin-user.schema');
const studentUserInstance = require('./schemes/student-user.schema');
const instructorUserInstance = require('./schemes/instructor-user.schema');
const coursesInstance = require('./schemes/courses.schema');
const coursesLessonInstance = require('./schemes/courses-lesson.schema');
const coursesInstructorInstance = require('./schemes/courses-instructor.schema');
const coursesStudentInstance = require('./schemes/courses-student.schema');
const {
  coursesInstructorAssociate,
  coursesLessonAssociate,
  coursesStudentAssociate,
} = require('./association-models');

const sequelizeInstance = new Sequelize(
  db.name,
  db.user,
  db.password,
  {
    host: db.host,
    dialect: db.dialect,
    dialectOptions: {
      multipleStatements: true,
    },
    logging: false,
    define: {
      timestamps: true,
      charset: db.charset,
    },
    pool: {
      max: Number(db.connectionLimitMax),
    },
  }
);

const refreshTokenModel = refreshTokenInstance(sequelizeInstance);
const adminUserModel = adminUserInstance(sequelizeInstance);
const studentUserModel = studentUserInstance(sequelizeInstance);
const instructorUserModel = instructorUserInstance(sequelizeInstance);
const coursesModel = coursesInstance(sequelizeInstance);
const coursesInstructorModel = coursesInstructorInstance(sequelizeInstance);
const coursesLessonModel = coursesLessonInstance(sequelizeInstance);
const coursesStudentModel = coursesStudentInstance(sequelizeInstance);

coursesInstructorAssociate(coursesInstructorModel, instructorUserModel, coursesModel);
coursesLessonAssociate(coursesLessonModel, coursesModel);
coursesStudentAssociate(coursesStudentModel, studentUserModel, coursesModel);

// IMPORTANT: The order is important. Make sure that the table that has foreign keys will be created after the main table
const models = [
  refreshTokenModel,
  adminUserModel,
  studentUserModel,
  instructorUserModel,
  coursesModel,
  coursesInstructorModel,
  coursesLessonModel,
  coursesStudentModel,
];

if (process.env.NODE_ENV === 'test') {
  sequelizeInstance.close();
} else {
  sequelizeInstance.authenticate()
    .then(() => {
      console.info(`Successfully connected to the database '${db.name}'`);
    });
}

const createTables = async () => {
  // can not use Promise.all because the order of tables is important
  // eslint-disable-next-line no-restricted-syntax
  for (const model of models) {
    // eslint-disable-next-line no-await-in-loop
    await model.sync({ force: false });
  }
};

module.exports = {
  createTables,
  refreshTokenModel,
  adminUserModel,
  studentUserModel,
  instructorUserModel,
  coursesModel,
  coursesInstructorModel,
  coursesLessonModel,
  coursesStudentModel,
  sequelizeInstance,
};
