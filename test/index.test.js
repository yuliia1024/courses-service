require('dotenv').config();

process.env.NODE_ENV = 'test';

describe('Tests:', () => {
  // Controllers

  // Services
  require('./unit-tests/services-tests/token-service.test');
  require('./unit-tests/services-tests/db-service.test');

  // Utils
  require('./unit-tests/utils-tests/utils.test');
});
