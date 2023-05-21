const { db } = require('./index');

module.exports = {
  development: {
    username: db.user,
    password: db.password,
    database: db.name,
    port: db.port,
    host: db.host,
    dialect: db.dialect,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
  },
  production: {
    username: db.user,
    password: db.password,
    database: db.name,
    port: db.port,
    host: db.host,
    dialect: db.dialect,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
  },
};
