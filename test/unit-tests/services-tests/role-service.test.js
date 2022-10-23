// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/services/role.service')];

const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const { UnauthorizedError, ForbiddenError } = require('../../../src/error-handler');
const { USER_ROLE } = require('../../../src/constants');
const { checkRole } = require('../../../src/services/role.service');

let reqMock;
let resMock;
const nextStub = sinon.stub().returns();

describe('role.service.js', () => {
  beforeEach(() => {
    reqMock = httpMocks.createRequest();
    resMock = httpMocks.createResponse();
  });
  afterEach(() => {
    nextStub.resetHistory();
  });

  describe('checkRole', () => {
    const roleMiddleware = checkRole([
      USER_ROLE.student,
      USER_ROLE.admin,
    ]);

    it('should call next() with an error if a role is not provided', () => {
      roleMiddleware(reqMock, resMock, nextStub);

      const error = nextStub.getCall(0).args[0];

      expect(error)
        .to.be.instanceOf(UnauthorizedError)
        .have.property('message')
        .contains('role is incorrect');
    });

    it('should call next() with an error if a role is not allowed', () => {
      const reqMockRole = httpMocks.createRequest({
        userRole: USER_ROLE.instructor,
      });

      roleMiddleware(reqMockRole, resMock, nextStub);

      const error = nextStub.getCall(0).args[0];

      expect(error)
        .to.be.instanceOf(ForbiddenError)
        .have.property('message')
        .contains('permission');
    });

    it('should call next() without any arguments', () => {
      const reqMockRole = httpMocks.createRequest({
        userRole: USER_ROLE.admin,
      });

      roleMiddleware(reqMockRole, resMock, nextStub);

      const error = nextStub.getCall(0).args[0];

      expect(error)
        .to.be.undefined;
    });
  });
});
