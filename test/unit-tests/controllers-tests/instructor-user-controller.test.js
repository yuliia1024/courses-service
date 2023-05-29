// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/controllers/instructor-user.controller')];

const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const { successResultDataMock } = require('../../test-utils');
const { mockExportedFunction } = require('../../test-utils');
const {
  HTTP_STATUS,
} = require('../../../src/constants');

let reqMock;
let resMock;

const createInstructorUserStub = sinon.stub();

const createInstructorBody = {
  firstName: 'intsr',
  lastName: 'student',
  email: 'byjfufzoufxdrgujlj@kvhrw.com',
};
const userIdMock = 'user_Id_Mock';

describe('instructor-user.controller.js', () => {
  beforeEach(() => {
    reqMock = httpMocks.createRequest({
      body: createInstructorBody,
      userId: userIdMock,
    });
    resMock = httpMocks.createResponse();
  });
  afterEach(() => {
    createInstructorUserStub.resetHistory();
  });

  describe('createInstructorController', () => {
    it('should create student user', async () => {
      const { createInstructorController } = mockExportedFunction(
        '../../src/controllers/instructor-user.controller.js',
        [
          {
            dependencyPath: '../../src/services/instructor-user.service',
            stubs: {
              createInstructorUser: createInstructorUserStub.resolves(),
            },
          },
        ],
      );

      await createInstructorController(reqMock, resMock);

      expect(createInstructorUserStub.calledOnceWithExactly(reqMock))
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
