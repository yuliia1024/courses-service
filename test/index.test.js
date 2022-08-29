require('dotenv').config();

process.env.NODE_ENV = 'test';

describe('Tests:', () => {
  // Controllers
  require('./unit-tests/controllers-tests/token-controller.test');

  // Services
  require('./unit-tests/services-tests/token-service.test');
  require('./unit-tests/services-tests/db-service.test');

  // Utils
  require('./unit-tests/utils-tests/utils.test');
});
