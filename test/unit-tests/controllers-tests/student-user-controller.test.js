// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/controllers/student-user.controller')];

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

const getAdminUserByIdStub = sinon.stub();
const createAdminUserStub = sinon.stub();
const updateAdminUserStub = sinon.stub();
const inactiveAdminUserStub = sinon.stub();
const getAllAdminsUserStub = sinon.stub();

const userMock = {
  id: 'id-mock',
  firstName: 'user',
  lastName: 'test',
  email: 'email.mock@n.com',
  role: USER_ROLE.admin,
};

const optionsMock = {
  offset: 1,
  limit: 2,
};
const adminsResultMock = {
  offset: 0,
  limit: 2,
  total: 1,
  records: [
    userMock,
  ],
};
const userIdMock = 'id_Mock_';

describe('token.controller.js', () => {
  beforeEach(() => {
    reqMock = httpMocks.createRequest({
      body: userMock,
      params: {
        id: userMock.id,
      },
      userId: userIdMock,
    });
    resMock = httpMocks.createResponse();
  });
  afterEach(() => {
    getAdminUserByIdStub.resetHistory();
    createAdminUserStub.resetHistory();
    updateAdminUserStub.resetHistory();
    inactiveAdminUserStub.resetHistory();
    getAllAdminsUserStub.resetHistory();
  });

  describe('createAdminController', () => {
    it('should create admin user', async () => {
      const { createAdminController } = mockExportedFunction(
        '../../src/controllers/admin-user.controller.js',
        [
          {
            dependencyPath: '../../src/services/admin-user.service',
            stubs: {
              createAdminUser: createAdminUserStub.resolves(),
            },
          },
        ],
      );

      await createAdminController(reqMock, resMock);

      expect(createAdminUserStub.calledOnceWithExactly(reqMock))
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

  describe('updateAdminController', () => {
    it('should update admin user', async () => {
      const { updateAdminController } = mockExportedFunction(
        '../../src/controllers/admin-user.controller.js',
        [
          {
            dependencyPath: '../../src/services/admin-user.service',
            stubs: {
              updateAdminUser: updateAdminUserStub.resolves(),
            },
          },
        ],
      );

      await updateAdminController(reqMock, resMock);

      expect(updateAdminUserStub.calledOnceWithExactly(userMock.id, userIdMock, userMock))
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

  describe('getAdminByIdController', () => {
    it('should get admin user by id', async () => {
      const { getAdminByIdController } = mockExportedFunction(
        '../../src/controllers/admin-user.controller.js',
        [
          {
            dependencyPath: '../../src/services/db.service',
            stubs: {
              getAdminUserById: getAdminUserByIdStub.resolves(userMock),
            },
          },
        ],
      );

      await getAdminByIdController(reqMock, resMock);

      expect(getAdminUserByIdStub.calledOnceWithExactly(userMock.id))
        .to.be.true;
      expect(resMock)
        .to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData())
        .to.be.an('object')
        .be.deep.equal(successResultDataMock(userMock));
    });
  });

  describe('deleteAdminController', () => {
    it('should delete admin user by id', async () => {
      const { deleteAdminController } = mockExportedFunction(
        '../../src/controllers/admin-user.controller.js',
        [
          {
            dependencyPath: '../../src/services/admin-user.service',
            stubs: {
              inactiveAdminUser: inactiveAdminUserStub.resolves(),
            },
          },
        ],
      );

      await deleteAdminController(reqMock, resMock);

      expect(inactiveAdminUserStub.calledOnceWithExactly(reqMock, userMock.id))
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

  describe('getAllAdminsController', () => {
    it('should get admin users by options', async () => {
      const reqOptionsMock = httpMocks.createRequest({
        body: optionsMock,
      });
      const { getAllAdminsController } = mockExportedFunction(
        '../../src/controllers/admin-user.controller.js',
        [
          {
            dependencyPath: '../../src/services/admin-user.service',
            stubs: {
              getAllAdminsUser: getAllAdminsUserStub.resolves(adminsResultMock),
            },
          },
        ],
      );

      await getAllAdminsController(reqOptionsMock, resMock);

      expect(getAllAdminsUserStub.calledOnceWithExactly(optionsMock))
        .to.be.true;
      expect(resMock)
        .to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData())
        .to.be.an('object')
        .be.deep.equal(successResultDataMock(adminsResultMock));
    });
  });
});
