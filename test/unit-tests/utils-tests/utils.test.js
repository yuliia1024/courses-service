// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/utils')];

const { expect } = require('chai');
const httpMocks = require('node-mocks-http');
const { HTTP_STATUS, HEADER_PARAMS } = require('../../../src/constants');
const {
  createCustomError,
  createHeader,
  getAccessTokenFromHeader,
  parseBoolean,
} = require('../../../src/utils');
const { BadRequestError, CustomError } = require('../../../src/error-handler');

const customError = {
  response: {
    status: 'some-status',
    statusText: 'some-statusText',
    data: {
      error: {
        message: 'some-message',
        stack: 'stack-trace',
      },
    },
  },
};
const defaultError = new Error(customError.response.data.error.message);
const customErrorData = {
  message: 'custom-error-message',
  metadata: {
    ...customError,
  },
  code: '777',
  httpError: 'custom-httpError',
};
const createdCustomError = new CustomError(
  customErrorData.message,
  customErrorData.metadata,
  customErrorData.code,
  customErrorData.httpError,
);
const header = {
  [HEADER_PARAMS.contentType]: 'content-type',
  [HEADER_PARAMS.contentLength]: 'content-length',
  'not-removed-field': 'not-removed-field',
};
const dbError = {
  errors: [{
    message: 'some DB error',
  }],
};
const dbDuplicateError = {
  ...dbError,
  original: {
    errno: 1062,
  },
};
// eslint-disable-next-line max-len
const accessTokenJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0ZjFlY2ZiNy1iNmYxLTQ2M2UtODgzOC0wM2M2NGQ0MmJkYWEiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjIyMTI3MjM4LCJleHAiOjE2MjIxMzA4Mzh9.XiCCQFHq0WE7IIyc4WoyQ9TYy2NN3tYeSXiEB2WHG-4';
const accessTokenAnother = 'accessTokenAnother_mock';

describe('utils', () => {
  describe('createCustomError', () => {
    it('should return custom error with the certain properties', () => {
      const result = createCustomError(customError);

      expect(result)
        .to.be.instanceOf(CustomError)
        .have.property('message')
        .be.equal(customError.response.data.error.message);
      expect(result)
        .have.property('code')
        .be.equal(customError.response.status);
      expect(result)
        .have.property('httpError')
        .be.equal(customError.response.statusText);
      expect(result)
        .have.property('metadata')
        .be.an('object');
      expect(result.metadata)
        .to.have.property('stack')
        .be.equal(customError.response.data.error.stack);
    });

    it('should return default bad request error', () => {
      const result = createCustomError(defaultError);

      expect(result)
        .to.be.instanceOf(Error)
        .have.property('message')
        .be.equal(customError.response.data.error.message);
      expect(result)
        .have.property('code')
        .be.equal(HTTP_STATUS.badRequest.code);
      expect(result)
        .have.property('httpError')
        .be.equal(HTTP_STATUS.badRequest.error);
    });

    it('should return the error that was created before', () => {
      const result = createCustomError(createdCustomError);

      expect(result)
        .to.be.instanceOf(CustomError)
        .have.property('message')
        .be.equal(customErrorData.message);
      expect(result)
        .have.property('code')
        .be.equal(customErrorData.code);
      expect(result)
        .have.property('httpError')
        .be.equal(customErrorData.httpError);
      expect(result)
        .have.property('metadata')
        .be.deep.equal(customErrorData.metadata);
    });

    it('should return DB error', () => {
      const result = createCustomError(dbError);

      expect(result)
        .to.be.instanceOf(Error)
        .have.property('message')
        .be.equal(dbError.errors[0].message);
      expect(result)
        .have.property('code')
        .be.equal(HTTP_STATUS.badRequest.code);
      expect(result)
        .have.property('httpError')
        .be.equal(HTTP_STATUS.badRequest.error);
    });

    it('should return DB duplicate error', () => {
      const result = createCustomError(dbDuplicateError);

      expect(result)
        .to.be.instanceOf(Error)
        .have.property('message')
        .be.equal(dbDuplicateError.errors[0].message);
      expect(result)
        .have.property('code')
        .be.equal(HTTP_STATUS.badRequest.code);
      expect(result)
        .have.property('httpError')
        .be.equal(HTTP_STATUS.badRequest.error);
    });
  });

  describe('createHeader', () => {
    it('should remove the exact properties', () => {
      const result = createHeader(header);

      expect(result)
        .to.not.include.any.keys(
          HEADER_PARAMS.contentType,
          HEADER_PARAMS.contentLength,
        );
    });
  });

  describe('getAccessTokenFromHeader', () => {
    it('should get JWT access token from the request header', () => {
      const payload = `Bearer ${accessTokenJWT}`;
      const reqMock = httpMocks.createRequest({
        headers: {
          [HEADER_PARAMS.authorization]: payload,
        },
      });
      const result = getAccessTokenFromHeader(reqMock);

      expect(result)
        .to.be.a('string');
      expect(result)
        .to.be.equal(accessTokenJWT);
    });

    it('should throw an error if a request header is empty', () => {
      const reqMock = httpMocks.createRequest();

      try {
        getAccessTokenFromHeader(reqMock);
      } catch (err) {
        expect(err)
          .to.be.instanceOf(BadRequestError)
          .to.have.property('message')
          .contains('Token');
      }
    });

    it('should throw an error if an access token with the wrong type of authorization header', () => {
      const payload = `WrongType ${accessTokenJWT}`;
      const reqMock = httpMocks.createRequest({
        headers: {
          [HEADER_PARAMS.authorization]: payload,
        },
      });

      try {
        getAccessTokenFromHeader(reqMock);
      } catch (err) {
        expect(err)
          .to.be.instanceOf(BadRequestError)
          .to.have.property('message')
          .contains('Token');
      }
    });

    it('should throw an error if an access token has no JWT type', () => {
      const payload = `Bearer ${accessTokenAnother}`;
      const reqMock = httpMocks.createRequest({
        headers: {
          [HEADER_PARAMS.authorization]: payload,
        },
      });

      try {
        getAccessTokenFromHeader(reqMock);
      } catch (err) {
        expect(err)
          .to.be.instanceOf(BadRequestError)
          .to.have.property('message')
          .contains('Token');
      }
    });
  });

  describe('parseBoolean', () => {
    it('should return boolean TRUE', () => {
      const result = parseBoolean('true');

      expect(result)
        .to.be.equal(true);
    });

    it('should return boolean FALSE', () => {
      const result = parseBoolean('false');

      expect(result)
        .to.be.equal(false);
    });

    it('should throw an error if the variable is incorrect', () => {
      try {
        parseBoolean('incorrect_value');
      } catch (err) {
        expect(err)
          .to.have.property('message')
          .contains('is not boolean');
      }
    });
  });
});
