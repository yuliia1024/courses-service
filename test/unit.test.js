require('dotenv').config();

process.env.NODE_ENV = 'unit-test';

describe('Unit Tests:', () => {
  // Controllers
  require('./unit-tests/controllers-tests/token-controller.test');
  require('./unit-tests/controllers-tests/auth-controller.test');
  require('./unit-tests/controllers-tests/admin-user-controller.test');
  require('./unit-tests/controllers-tests/student-user-controller.test');
  require('./unit-tests/controllers-tests/instructor-user-controller.test');
  require('./unit-tests/controllers-tests/courses-controller.test');
  require('./unit-tests/controllers-tests/homeworks-controller.test');

  // Services
  require('./unit-tests/services-tests/token-service.test');
  require('./unit-tests/services-tests/db-service.test');
  require('./unit-tests/services-tests/role-service.test');
  require('./unit-tests/services-tests/student-user-service.test');
  require('./unit-tests/services-tests/homework-service.test');
  require('./unit-tests/services-tests/courses-service.test');

  // Utils
  require('./unit-tests/utils-tests/utils.test');
});
