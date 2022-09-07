const Sequelize = require('sequelize');
const { db } = require('../../config');
const refreshTokenInstance = require('./schemes/refresh-token.schema');
const adminUserInstance = require('./schemes/admin-user.schema');
const studentUserInstance = require('./schemes/student-user.schema');
const instructorUserInstance = require('./schemes/instructor-user.schema');

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

// IMPORTANT: The order is important. Make sure that the table that has foreign keys will be created after the main table
const models = [
  refreshTokenModel,
  adminUserModel,
  studentUserModel,
  instructorUserModel,
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
  for (const model of models) {
    await model.sync({ force: false });
  }
};

module.exports = {
  createTables,
  refreshTokenModel,
  adminUserModel,
  studentUserModel,
  instructorUserModel,
  sequelizeInstance,
};
