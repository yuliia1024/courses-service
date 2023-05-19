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
  STUDENT_COURSES_STATUS,
} = require('../../../src/constants');

let reqMock;
let resMock;

const createStudentUserStub = sinon.stub();
const checkUserPermissionToAccessCourseInfoStub = sinon.stub();
const getAllStudentsUserStub = sinon.stub();
const addStudentFeedbackStub = sinon.stub();
const getStudentIdsByOptionStub = sinon.stub();

const createStudentBody = {
  firstName: 'intsr',
  lastName: 'student',
  email: 'byjfufzoufxdrgujlj@kvhrw.com',
};
const userMock = {
  ...createStudentBody,
  id: 'id-mock',
  role: USER_ROLE.admin,
};
const optionsMock = {
  offset: 1,
  limit: 2,
};
const studentsResultMock = {
  offset: 0,
  limit: 2,
  total: 1,
  records: [
    userMock,
  ],
};
const userIdMock = 'id_Mock_';
const idMock = 'some_id_Mock';

describe('student-user.controller.js', () => {
  beforeEach(() => {
    reqMock = httpMocks.createRequest({
      body: createStudentBody,
      params: {
        id: userMock.id,
      },
      userId: userIdMock,
    });
    resMock = httpMocks.createResponse();
  });
  afterEach(() => {
    createStudentUserStub.resetHistory();
    checkUserPermissionToAccessCourseInfoStub.resetHistory();
    getAllStudentsUserStub.resetHistory();
    addStudentFeedbackStub.resetHistory();
    getStudentIdsByOptionStub.resetHistory();
  });

  describe('createStudentController', () => {
    it('should create student user', async () => {
      const { createStudentController } = mockExportedFunction(
        '../../src/controllers/student-user.controller.js',
        [
          {
            dependencyPath: '../../src/services/student-user.service',
            stubs: {
              createStudentUser: createStudentUserStub.resolves(),
            },
          },
        ],
      );

      await createStudentController(reqMock, resMock);

      expect(createStudentUserStub.calledOnceWithExactly(reqMock))
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

  describe('addStudentFeedbackController', () => {
    const feedbackReqMock = httpMocks.createRequest({
      body: {
        courseId: 'course-Id',
        studentId: userIdMock,
        feedback: 'good soup',
      },
      userRole: USER_ROLE.instructor,
      userId: userIdMock,
    });

    it('should create feedback for student user', async () => {
      const { addStudentFeedbackController } = mockExportedFunction(
        '../../src/controllers/student-user.controller.js',
        [
          {
            dependencyPath: '../../src/services/student-user.service',
            stubs: {
              addStudentFeedback: addStudentFeedbackStub.resolves(),
            },
          },
        ],
      );

      await addStudentFeedbackController(feedbackReqMock, resMock);

      expect(addStudentFeedbackStub.calledOnceWithExactly(feedbackReqMock.body, USER_ROLE.instructor, userIdMock))
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

  describe('getAllStudentsController', () => {
    it('should get student users', async () => {
      const coursesReqMock = httpMocks.createRequest({
        body: {
          ...optionsMock,
        },
        userRole: USER_ROLE.instructor,
        userId: userIdMock,
      });

      const { getAllStudentsController } = mockExportedFunction(
        '../../src/controllers/student-user.controller.js',
        [
          {
            dependencyPath: '../../src/services/student-user.service',
            stubs: {
              getAllStudentsUser: getAllStudentsUserStub.resolves(studentsResultMock),
            },
          },
          {
            dependencyPath: '../../src/services/db.service',
            stubs: {
              getStudentIdsByOption: getStudentIdsByOptionStub.resolves(),
            },
          },
          {
            dependencyPath: '../../src/services/courses.service',
            stubs: {
              checkUserPermissionToAccessCourseInfo: checkUserPermissionToAccessCourseInfoStub.resolves(),
            },
          },
        ],
      );

      await getAllStudentsController(coursesReqMock, resMock);

      expect(checkUserPermissionToAccessCourseInfoStub.notCalled);
      expect(getStudentIdsByOptionStub.notCalled);
      expect(getAllStudentsUserStub.calledOnceWithExactly(optionsMock, undefined))
        .to.be.true;
      expect(resMock)
        .to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData())
        .to.be.an('object')
        .be.deep.equal(successResultDataMock(studentsResultMock));
    });

    it('should get student users by courses id', async () => {
      const coursesReqMock = httpMocks.createRequest({
        body: {
          ...optionsMock,
          courseId: idMock,
          courseStatus: STUDENT_COURSES_STATUS.inProgress,
        },
        userRole: USER_ROLE.instructor,
        userId: userIdMock,
      });

      const { getAllStudentsController } = mockExportedFunction(
        '../../src/controllers/student-user.controller.js',
        [
          {
            dependencyPath: '../../src/services/student-user.service',
            stubs: {
              getAllStudentsUser: getAllStudentsUserStub.resolves(studentsResultMock),
            },
          },
          {
            dependencyPath: '../../src/services/db.service',
            stubs: {
              getStudentIdsByOption: getStudentIdsByOptionStub.resolves([userIdMock]),
            },
          },
          {
            dependencyPath: '../../src/services/courses.service',
            stubs: {
              checkUserPermissionToAccessCourseInfo: checkUserPermissionToAccessCourseInfoStub.resolves(),
            },
          },
        ],
      );

      await getAllStudentsController(coursesReqMock, resMock);

      expect(checkUserPermissionToAccessCourseInfoStub.calledOnceWithExactly(USER_ROLE.instructor, userIdMock, idMock))
        .to.be.true;
      expect(getStudentIdsByOptionStub.calledOnceWithExactly({
        courseId: idMock,
        status: STUDENT_COURSES_STATUS.inProgress,
      }))
        .to.be.true;
      expect(getAllStudentsUserStub.calledOnceWithExactly({
        ...optionsMock,
        courseId: idMock,
        courseStatus: STUDENT_COURSES_STATUS.inProgress,
      }, [userIdMock]))
        .to.be.true;
      expect(resMock)
        .to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData())
        .to.be.an('object')
        .be.deep.equal(successResultDataMock(studentsResultMock));
    });
  });
});
