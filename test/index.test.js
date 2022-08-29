require('dotenv').config();

process.env.NODE_ENV = 'test';

describe('Tests:', () => {
  // Controllers

  // Services
  require('./unit/unit-tests/services-tests/token-service.test');
  require('./unit/unit-tests/services-tests/db-service.test');

  // Utils
  require('./unit/unit-tests/utils-tests/utils.test');
});
