// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/services/db.service')];

const sinon = require('sinon');
const Sequelize = require('sequelize');
const { DB_CONTRACT } = require('../../../../db/db.contract');
const { refreshTokenModel } = require('../../../../db');
const {
  saveRefreshToken,
  removeRefreshTokenByUserId,
  removeRefreshTokenByTokens,
  removeRefreshTokensByArrayUsersIds,
} = require('../../../../src/services/db.service');

let refreshTokenModelMock;
const data = {
  userId: 'userId_mock',
  exp: 1622130838,
  refreshToken: 'refreshToken_mock',
  accessToken: 'accessToken_mock',
};
const usersIdsMock = [
  '157c9cb9-9498-4010-8cd3-26fe2bdf4d47',
  '19527ee1-b460-4b55-8fd2-676c162b7301',
  '1e3dea99-0758-46de-987b-96fcae51cb68',
];

describe('db.service.js', () => {
  beforeEach(() => {
    refreshTokenModelMock = sinon.mock(refreshTokenModel);
  });
  afterEach(() => {
    refreshTokenModelMock.restore();
  });

  describe('saveRefreshToken', () => {
    it('should save refresh token', async () => {
      refreshTokenModelMock
        .expects('create')
        .withArgs({
          [DB_CONTRACT.refreshToken.userId.property]: data.userId,
          [DB_CONTRACT.refreshToken.expirationTime.property]: data.exp,
          [DB_CONTRACT.refreshToken.refreshToken.property]: data.refreshToken,
          [DB_CONTRACT.refreshToken.accessToken.property]: data.accessToken,
        })
        .once()
        .resolves();

      await saveRefreshToken(data);

      refreshTokenModelMock.verify();
    });
  });

  describe('removeRefreshTokenByUserId', () => {
    it('should remove refresh token by user ID', async () => {
      refreshTokenModelMock
        .expects('destroy')
        .withArgs({
          where: {
            [DB_CONTRACT.refreshToken.userId.property]: data.userId,
          },
        })
        .once()
        .resolves();

      await removeRefreshTokenByUserId(data.userId);

      refreshTokenModelMock.verify();
    });
  });

  describe('removeRefreshTokenByTokens', () => {
    it('should remove refresh token by tokens', async () => {
      refreshTokenModelMock
        .expects('destroy')
        .withArgs({
          where: {
            [DB_CONTRACT.refreshToken.userId.property]: data.userId,
            [DB_CONTRACT.refreshToken.refreshToken.property]: data.refreshToken,
            [DB_CONTRACT.refreshToken.accessToken.property]: data.accessToken,
          },
        })
        .once()
        .resolves();

      await removeRefreshTokenByTokens(data);

      refreshTokenModelMock.verify();
    });
  });

  describe('removeRefreshTokensByArrayUsersIds', () => {
    it('should remove refresh token by array of users IDs', async () => {
      refreshTokenModelMock
        .expects('destroy')
        .withArgs({
          where: {
            [DB_CONTRACT.refreshToken.userId.property]: {
              [Sequelize.Op.or]: usersIdsMock,
            },
          },
        })
        .once()
        .resolves();

      await removeRefreshTokensByArrayUsersIds(usersIdsMock);

      refreshTokenModelMock.verify();
    });
  });
});
