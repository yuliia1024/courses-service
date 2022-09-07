const { DB_CONTRACT } = require('../db.contract');
const data = require('./data/admin-user.data');
const { sequelizeInstance } = require('../index');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.insert(
    sequelizeInstance,
    DB_CONTRACT.adminUser.tableName,
    data,
  ),

  down: (queryInterface, Sequelize) => queryInterface.delete(
    sequelizeInstance,
    DB_CONTRACT.adminUser.tableName,
    {
      where: {
        [DB_CONTRACT.common.id.property]: data.id,
      },
    },
  ),
};
