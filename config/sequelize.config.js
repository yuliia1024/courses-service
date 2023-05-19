const { db } = require('./index');

module.exports = {
  development: {
    username: db.user,
    password: db.password,
    database: db.name,
    host: db.host,
    dialect: db.dialect,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
  },
  production: {
    username: db.user,
    password: db.password,
    database: db.name,
    host: db.host,
    dialect: db.dialect,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
    timeout: 60000,
  },
};
