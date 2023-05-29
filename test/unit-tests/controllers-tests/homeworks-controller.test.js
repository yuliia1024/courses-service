// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/controllers/homework.controller')];

const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const { successResultDataMock } = require('../../test-utils');
const { mockExportedFunction } = require('../../test-utils');
const {
  HTTP_STATUS,
  USER_ROLE,
} = require('../../../src/constants');
const { ForbiddenError } = require('../../../src/error-handler');

let reqMock;
let resMock;

const createHomeworkStub = sinon.stub();
const markHomeworkStub = sinon.stub();

const homeworkBody = {
  studentId: 'some-student-id',
  lessonId: 'some_lesson_id',
};
const markHomeworkBody = {
  mark: 80,
  courseLessonId: homeworkBody.lessonId,
  studentId: homeworkBody.studentId,
};
const userIdMock = 'user_Id_Mock';
const homeworkIdMock = 'homework_Id_Mock';

describe('homework.controller.js', () => {
  beforeEach(() => {
    resMock = httpMocks.createResponse();
  });
  afterEach(() => {
    createHomeworkStub.resetHistory();
    markHomeworkStub.resetHistory();
  });

  describe('createHomeworkController', () => {
    it('should create student user', async () => {
      reqMock = httpMocks.createRequest({
        body: homeworkBody,
        file: '',
        userId: userIdMock,
        userRole: USER_ROLE.admin,
      });
      const { createHomeworkController } = mockExportedFunction(
        '../../src/controllers/homework.controller.js',
        [
          {
            dependencyPath: '../../src/services/homework.service',
            stubs: {
              createHomework: createHomeworkStub.resolves(),
            },
          },
        ],
      );

      await createHomeworkController(reqMock, resMock);

      expect(createHomeworkStub.calledOnceWithExactly(homeworkBody, '', userIdMock))
        .to.be.true;
      expect(resMock).to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData()).to.be.an('object')
        .be.deep.equal(successResultDataMock());
    });

    it('should throw ForbiddenError', async () => {
      reqMock = httpMocks.createRequest({
        body: homeworkBody,
        file: '',
        userId: userIdMock,
        userRole: USER_ROLE.student,
      });
      const { createHomeworkController } = mockExportedFunction(
        '../../src/controllers/homework.controller.js',
        [
          {
            dependencyPath: '../../src/services/homework.service',
            stubs: {
              createHomework: createHomeworkStub.resolves(),
            },
          },
        ],
      );

      try {
        await createHomeworkController(reqMock, resMock);
      } catch (err) {
        expect(createHomeworkStub.notCalled)
          .to.be.true;
        expect(err)
          .to.be.instanceOf(ForbiddenError)
          .have.property('message')
          .contains('You can create homework only for yourself.');
      }
    });
  });

  describe('markHomeworkController', () => {
    it('should mark homework', async () => {
      reqMock = httpMocks.createRequest({
        body: markHomeworkBody,
        params: {
          id: homeworkIdMock,
        },
        userId: userIdMock,
        userRole: USER_ROLE.admin,
      });
      const { markHomeworkController } = mockExportedFunction(
        '../../src/controllers/homework.controller.js',
        [
          {
            dependencyPath: '../../src/services/homework.service',
            stubs: {
              markHomework: markHomeworkStub.resolves(),
            },
          },
        ],
      );

      await markHomeworkController(reqMock, resMock);

      expect(markHomeworkStub.calledOnceWithExactly(homeworkIdMock, markHomeworkBody, userIdMock, USER_ROLE.admin))
        .to.be.true;
      expect(resMock).to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData()).to.be.an('object')
        .be.deep.equal(successResultDataMock());
    });
  });
});
