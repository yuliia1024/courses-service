// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/services/token.service')];

const { omit } = require('lodash');
const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');
const { tokenConfig } = require('../../../../config');
const { TOKEN_TYPES } = require('../../../../src/constants');
const { mockExportedFunction } = require('../../test-utils');
const { redisClient } = require('../../../../src/services/redis.service');
const { BadRequestError } = require('../../../../src/error-handler');

let jwtMock;
let redisClientMock;
let reqMock;

const removeRefreshTokenByUserIdStub = sinon.stub();
const saveRefreshTokenStub = sinon.stub();
const removeRefreshTokenByTokensStub = sinon.stub();
const getAccessTokenFromHeaderStub = sinon.stub();
const removeRefreshTokensByArrayUsersIdsStub = sinon.stub();
const createCustomErrorStub = sinon.stub();
const assignLastLoginStub = sinon.stub();

const userIdMock = 'userId_mock';
const usersIdsArrayMock = [
  '157c9cb9-9498-4010-8cd3-26fe2bdf4d47',
  '19527ee1-b460-4b55-8fd2-676c162b7301',
  '1e3dea99-0758-46de-987b-96fcae51cb68',
];
const expMock = 123456;
const accessTokenMock = 'access-token-mock';
const accessTokenDecodedMock = {
  userId: userIdMock,
  type: TOKEN_TYPES.access,
  exp: expMock,
};
const refreshTokenMock = 'refresh-token-mock';
const refreshTokenDecodedMock = {
  userId: userIdMock,
  type: TOKEN_TYPES.refresh,
  exp: expMock,
};
const generateTokenPayload = {
  userId: 'userId_mock',
  key: 'value_mock',
};

describe('tokens.service.js', () => {
  beforeEach(() => {
    jwtMock = sinon.mock(jwt);
    redisClientMock = sinon.mock(redisClient);
    reqMock = httpMocks.createRequest();
  });
  afterEach(() => {
    jwtMock.restore();
    redisClientMock.restore();
    removeRefreshTokenByUserIdStub.resetHistory();
    saveRefreshTokenStub.resetHistory();
    removeRefreshTokenByTokensStub.resetHistory();
    getAccessTokenFromHeaderStub.resetHistory();
    removeRefreshTokensByArrayUsersIdsStub.resetHistory();
    createCustomErrorStub.resetHistory();
    assignLastLoginStub.resetHistory();
  });

  describe('createToken', () => {
    it('should generate access and refresh tokens', async () => {
      const { generateTokens } = mockExportedFunction(
        '../../src/services/token.service',
        [
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              removeRefreshTokenByUserId: removeRefreshTokenByUserIdStub.resolves(),
              saveRefreshToken: saveRefreshTokenStub.resolves(),
            },
          },
        ],
      );

      redisClientMock
        .expects('setex')
        .withArgs(
          userIdMock,
          tokenConfig.expireAccessToken,
          accessTokenMock,
        )
        .once();

      jwtMock
        .expects('sign')
        .withArgs(
          {
            ...generateTokenPayload,
            type: TOKEN_TYPES.access,
          },
          tokenConfig.secretKey,
          {
            expiresIn: tokenConfig.expireAccessToken,
          },
        )
        .once()
        .returns(accessTokenMock);
      jwtMock
        .expects('sign')
        .withArgs(
          {
            ...generateTokenPayload,
            type: TOKEN_TYPES.refresh,
          },
          tokenConfig.secretKey,
          {
            expiresIn: tokenConfig.expireRefreshToken,
          },
        )
        .once()
        .returns(refreshTokenMock);
      jwtMock
        .expects('decode')
        .withArgs(refreshTokenMock)
        .once()
        .returns(refreshTokenDecodedMock);

      await generateTokens(generateTokenPayload);

      expect(removeRefreshTokenByUserIdStub.calledOnceWithExactly(userIdMock))
        .to.be.true;
      expect(saveRefreshTokenStub.calledOnceWithExactly({
        userId: userIdMock,
        exp: expMock,
        accessToken: accessTokenMock,
        refreshToken: refreshTokenMock,
      })).to.be.true;

      jwtMock.verify();
      redisClientMock.verify();
    });

    it('should throw an error if userId is not provided', async () => {
      const { generateTokens } = mockExportedFunction(
        '../../src/services/token.service',
        [
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              removeRefreshTokenByUserId: removeRefreshTokenByUserIdStub.resolves(),
              saveRefreshToken: saveRefreshTokenStub.resolves(),
            },
          },
        ],
      );

      try {
        await generateTokens(reqMock, omit(generateTokenPayload, 'userId'));
      } catch (err) {
        expect(err)
          .to.be.instanceOf(BadRequestError)
          .have.property('message')
          .contains('ID');
      }
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify access token', async () => {
      const { verifyAccessToken } = mockExportedFunction(
        '../../src/services/token.service',
      );

      redisClientMock
        .expects('get')
        .withArgs(userIdMock)
        .once()
        .returns(accessTokenMock);

      jwtMock
        .expects('decode')
        .withArgs(accessTokenMock)
        .once()
        .returns(accessTokenDecodedMock);

      jwtMock
        .expects('verify')
        .withArgs(accessTokenMock, tokenConfig.secretKey)
        .once();

      await verifyAccessToken(accessTokenMock);

      jwtMock.verify();
      redisClientMock.verify();
    });

    it('should throw an error if token type is incorrect', async () => {
      const { verifyAccessToken } = mockExportedFunction(
        '../../src/services/token.service',
      );

      redisClientMock
        .expects('get')
        .never();

      jwtMock
        .expects('decode')
        .withArgs(accessTokenMock)
        .once()
        .returns(refreshTokenDecodedMock);

      jwtMock
        .expects('verify')
        .never();

      try {
        await verifyAccessToken(accessTokenMock);
      } catch (err) {
        expect(err)
          .to.be.instanceOf(Error)
          .have.property('message')
          .contains('is incorrect');
      }

      jwtMock.verify();
      redisClientMock.verify();
    });

    it('should throw an error if redis does not return a token', async () => {
      const { verifyAccessToken } = mockExportedFunction(
        '../../src/services/token.service',
      );

      redisClientMock
        .expects('get')
        .withArgs(userIdMock)
        .once()
        .returns(null);

      jwtMock
        .expects('decode')
        .withArgs(accessTokenMock)
        .once()
        .returns(accessTokenDecodedMock);

      jwtMock
        .expects('verify')
        .never();

      try {
        await verifyAccessToken(accessTokenMock);
      } catch (err) {
        expect(err)
          .to.be.instanceOf(Error)
          .have.property('message')
          .be.equal('jwt expired');
      }

      jwtMock.verify();
      redisClientMock.verify();
    });

    it('should throw an error if redis returns another token', async () => {
      const { verifyAccessToken } = mockExportedFunction(
        '../../src/services/token.service',
        [
        ],
      );

      redisClientMock
        .expects('get')
        .withArgs(userIdMock)
        .once()
        .returns('another token');

      jwtMock
        .expects('decode')
        .withArgs(accessTokenMock)
        .once()
        .returns(accessTokenDecodedMock);

      jwtMock
        .expects('verify')
        .never();

      try {
        await verifyAccessToken(accessTokenMock);
      } catch (err) {
        expect(err)
          .to.be.instanceOf(Error)
          .have.property('message')
          .be.equal('jwt expired');
      }

      jwtMock.verify();
      redisClientMock.verify();
    });
  });

  describe('decodeToken', () => {
    it('should decode token', () => {
      const { decodeToken } = mockExportedFunction(
        '../../src/services/token.service',
      );

      jwtMock
        .expects('decode')
        .withArgs(accessTokenMock)
        .once();

      decodeToken(accessTokenMock);

      jwtMock.verify();
    });
  });

  describe('checkAndRemoveRefreshToken', () => {
    it('should remove refresh token', async () => {
      const { checkAndRemoveRefreshToken } = mockExportedFunction(
        '../../src/services/token.service',
        [
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              removeRefreshTokenByTokens: removeRefreshTokenByTokensStub.resolves(1),
            },
          },
          {
            dependencyPath: '../../src/utils',
            stubs: {
              createCustomError: createCustomErrorStub.returns(),
            },
          },
        ],
      );

      jwtMock
        .expects('decode')
        .withArgs(refreshTokenMock)
        .once()
        .returns(refreshTokenDecodedMock);

      await checkAndRemoveRefreshToken(accessTokenMock, refreshTokenMock);

      expect(removeRefreshTokenByTokensStub.calledOnceWithExactly({
        userId: userIdMock,
        accessToken: accessTokenMock,
        refreshToken: refreshTokenMock,
      })).to.be.true;
      expect(createCustomErrorStub.notCalled)
        .to.be.true;

      jwtMock.verify();
    });

    it('should throw an error if token is incorrect', async () => {
      const { checkAndRemoveRefreshToken } = mockExportedFunction(
        '../../src/services/token.service',
        [
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              removeRefreshTokenByTokens: removeRefreshTokenByTokensStub.resolves(null),
            },
          },
          {
            dependencyPath: '../../src/utils',
            stubs: {
              createCustomError: createCustomErrorStub.returns(),
            },
          },
        ],
      );

      jwtMock
        .expects('decode')
        .withArgs(refreshTokenMock)
        .once()
        .returns(refreshTokenDecodedMock);

      try {
        await checkAndRemoveRefreshToken(accessTokenMock, refreshTokenMock);
      } catch (err) {
        expect(removeRefreshTokenByTokensStub.calledOnceWithExactly({
          userId: userIdMock,
          accessToken: accessTokenMock,
          refreshToken: refreshTokenMock,
        })).to.be.true;

        expect(createCustomErrorStub.calledOnce)
          .to.be.true;
      }

      jwtMock.verify();
    });
  });

  describe('declineTokens', () => {
    it('should decline tokens', async () => {
      const { declineTokens } = mockExportedFunction(
        '../../src/services/token.service',
        [
          {
            dependencyPath: '../../src/utils',
            stubs: {
              getAccessTokenFromHeader: getAccessTokenFromHeaderStub.returns(accessTokenMock),
            },
          },
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              removeRefreshTokenByUserId: removeRefreshTokenByUserIdStub.resolves(),
            },
          },
        ],
      );

      jwtMock
        .expects('decode')
        .withArgs(accessTokenMock)
        .once()
        .returns(accessTokenDecodedMock);

      redisClientMock
        .expects('del')
        .withArgs(userIdMock)
        .once();

      await declineTokens(reqMock);

      expect(removeRefreshTokenByUserIdStub.calledOnceWithExactly(userIdMock))
        .to.be.true;

      jwtMock.verify();
      redisClientMock.verify();
    });
  });

  describe('declineTokensByAdmin', () => {
    it('should decline tokens by admin', async () => {
      const { declineTokensByAdmin } = mockExportedFunction(
        '../../src/services/token.service',
        [
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              removeRefreshTokenByUserId: removeRefreshTokenByUserIdStub.resolves(),
            },
          },
        ],
      );

      redisClientMock
        .expects('del')
        .withArgs(userIdMock)
        .once();

      await declineTokensByAdmin(userIdMock);

      expect(removeRefreshTokenByUserIdStub.calledOnceWithExactly(userIdMock))
        .to.be.true;

      redisClientMock.verify();
    });
  });

  describe('declineTokenByIds', () => {
    it('should decline tokens by admin', async () => {
      const { declineTokenByIds } = mockExportedFunction(
        '../../src/services/token.service',
        [
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              removeRefreshTokensByArrayUsersIds: removeRefreshTokensByArrayUsersIdsStub.resolves(),
            },
          },
        ],
      );

      redisClientMock
        .expects('del')
        .thrice();

      await declineTokenByIds(usersIdsArrayMock);

      expect(removeRefreshTokensByArrayUsersIdsStub.calledOnceWithExactly(usersIdsArrayMock))
        .to.be.true;

      redisClientMock.verify();
    });
  });
});
