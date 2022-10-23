// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/controllers/token.controller')];

const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const { successResultDataMock } = require('../../test-utils');
const { mockExportedFunction } = require('../../test-utils');
const { HTTP_STATUS } = require('../../../src/constants');

let reqMock;
let resMock;

const generateTokensStub = sinon.stub();
const getAccessTokenFromHeaderStub = sinon.stub();
const checkAndRemoveRefreshTokenStub = sinon.stub();
const verifyUserTokenStub = sinon.stub();
const decodeTokenStub = sinon.stub();

const tokenMock = 'token_mock';
const userIdMock = 'userId_mock';
const tokenPayloadMock = {
  userId: userIdMock,
  usersIds: [userIdMock],
  role: {
    name: 'some role name',
    value: 50,
  },
  key: 'value_mock',
};
const tokensResponseMock = {
  accessToken: tokenMock,
  refreshToken: tokenMock,
};

describe('token.controller.js', () => {
  beforeEach(() => {
    reqMock = httpMocks.createRequest({
      body: tokenPayloadMock,
    });
    resMock = httpMocks.createResponse();
  });
  afterEach(() => {
    generateTokensStub.resetHistory();
    getAccessTokenFromHeaderStub.resetHistory();
    checkAndRemoveRefreshTokenStub.resetHistory();
    verifyUserTokenStub.resetHistory();
    decodeTokenStub.resetHistory();
  });

  describe('refreshTokenController', () => {
    it('should generate new tokens by refresh token', async () => {
      reqMock = httpMocks.createRequest({
        body: { refreshToken: tokenMock },
      });

      const { refreshTokenController } = mockExportedFunction(
        '../../src/controllers/token.controller.js',
        [
          {
            dependencyPath: '../../src/utils',
            stubs: {
              getAccessTokenFromHeader: getAccessTokenFromHeaderStub.returns(tokenMock),
            },
          },
          {
            dependencyPath: '../../src/services/token.service.js',
            stubs: {
              checkAndRemoveRefreshToken: checkAndRemoveRefreshTokenStub.resolves(),
              verifyUserToken: verifyUserTokenStub.returns(tokenPayloadMock),
              decodeToken: decodeTokenStub.returns(tokenPayloadMock),
              generateTokens: generateTokensStub.resolves(tokensResponseMock),
            },
          },
        ],
      );

      await refreshTokenController(reqMock, resMock);

      expect(getAccessTokenFromHeaderStub.calledOnceWithExactly(reqMock))
        .to.be.true;
      expect(checkAndRemoveRefreshTokenStub.calledOnceWithExactly(tokenMock, tokenMock))
        .to.be.true;
      expect(verifyUserTokenStub.calledOnceWithExactly(tokenMock))
        .to.be.true;
      expect(decodeTokenStub.calledOnceWithExactly(tokenMock))
        .to.be.true;
      expect(generateTokensStub.calledOnce)
        .to.be.true;
      expect(resMock)
        .to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData())
        .to.be.an('object')
        .be.deep.equal(successResultDataMock(tokensResponseMock));
    });
  });

  describe('declineTokenController', () => {
    it('should remove refresh token', async () => {
      const { declineTokenController } = mockExportedFunction(
        '../../src/controllers/token.controller.js',
        [
          {
            dependencyPath: '../../src/services/token.service.js',
            stubs: {
              declineTokens: decodeTokenStub.resolves(),
            },
          },
        ],
      );

      await declineTokenController(reqMock, resMock);

      expect(decodeTokenStub.calledOnceWithExactly(reqMock))
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
});
