const { DB_CONTRACT } = require('../../db.contract');
const { USER_ROLE } = require('../../../constants');

const defaultAdminId = 'a05fb7a6-ef20-4240-ac40-0e33325458b2';

const defaultColumns = {
  [DB_CONTRACT.common.createdAt.column]: new Date(),
  [DB_CONTRACT.common.updatedAt.column]: new Date(),
  [DB_CONTRACT.common.createdBy.column]: defaultAdminId,
  [DB_CONTRACT.common.updatedBy.column]: defaultAdminId,
};

module.exports = {
  [DB_CONTRACT.common.id.column]: defaultAdminId,
  [DB_CONTRACT.adminUser.firstName.column]: 'Default',
  [DB_CONTRACT.adminUser.lastName.column]: 'Admin',
  [DB_CONTRACT.adminUser.email.column]: 'admin@courses.com',
  [DB_CONTRACT.adminUser.isActive.column]: true,
  [DB_CONTRACT.adminUser.hashPassword.column]: '$2b$10$ocQ3iMhstEwKPG1Fru6PS.wQ5/xmO4WWHQysXvQvR6D52VXVAHpWC',
  [DB_CONTRACT.adminUser.role.column]: USER_ROLE.admin,
  ...defaultColumns,
};
