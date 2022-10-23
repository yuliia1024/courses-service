// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/controllers/auth.controller')];

const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const { successResultDataMock } = require('../../test-utils');
const { mockExportedFunction } = require('../../test-utils');
const {
  HTTP_STATUS,
  USER_ROLE,
} = require('../../../src/constants');

let reqMock;
let resMock;

const registrationUserStub = sinon.stub();
const generateTokensStub = sinon.stub();
const loginUserStub = sinon.stub();

const userMock = {
  id: 'id-mock',
  firstName: 'user',
  lastName: 'test',
  email: 'email.mock@n.com',
  role: USER_ROLE.student,
};

const tokenMock = 'token_mock';

const tokensMock = {
  accessToken: tokenMock,
  refreshToken: tokenMock,
};

describe('token.controller.js', () => {
  beforeEach(() => {
    reqMock = httpMocks.createRequest({
      body: userMock,
    });
    resMock = httpMocks.createResponse();
  });
  afterEach(() => {
    generateTokensStub.resetHistory();
    registrationUserStub.resetHistory();
    loginUserStub.resetHistory();
  });

  describe('registrationUserController', () => {
    it('should register user', async () => {
      const { registrationUserController } = mockExportedFunction(
        '../../src/controllers/auth.controller.js',
        [
          {
            dependencyPath: '../../src/services/auth.service',
            stubs: {
              registrationUser: registrationUserStub.resolves(),
            },
          },
        ],
      );

      await registrationUserController(reqMock, resMock);

      expect(registrationUserStub.calledOnceWithExactly(userMock))
        .to.be.true;
      expect(resMock)
        .to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData())
        .to.be.an('object')
        .be.deep.equal(successResultDataMock());
    });
  });

  describe('loginUserController', () => {
    it('should logined user', async () => {
      const { loginUserController } = mockExportedFunction(
        '../../src/controllers/auth.controller.js',
        [
          {
            dependencyPath: '../../src/services/auth.service',
            stubs: {
              loginUser: loginUserStub.resolves(userMock),
            },
          },
          {
            dependencyPath: '../../src/services/token.service',
            stubs: {
              generateTokens: generateTokensStub.resolves(tokensMock),
            },
          },
        ],
      );

      await loginUserController(reqMock, resMock);

      expect(loginUserStub.calledOnceWithExactly(userMock))
        .to.be.true;
      expect(generateTokensStub.calledOnceWithExactly({
        userId: userMock.id,
        role: userMock.role,
      }))
        .to.be.true;
      expect(resMock)
        .to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData())
        .to.be.an('object')
        .be.deep.equal(successResultDataMock({
          user: userMock,
          tokens: tokensMock,
        }));
    });
  });
});
