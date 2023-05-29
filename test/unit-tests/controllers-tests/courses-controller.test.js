// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/controllers/courses.controller')];

const { expect } = require('chai');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const { successResultDataMock } = require('../../test-utils');
const { mockExportedFunction } = require('../../test-utils');
const {
  HTTP_STATUS,
  USER_ROLE,
} = require('../../../src/constants');
const { DB_CONTRACT } = require('../../../src/db/db.contract');
const { ForbiddenError } = require('../../../src/error-handler');

let reqMock;
let resMock;

const getAllCoursesByInstructorsIdStub = sinon.stub();
const getCoursesByStudentIdAndOptionsStub = sinon.stub();
const getActiveInstructorUserByIdStub = sinon.stub();
const assignInstructorsForCourseStub = sinon.stub();
const getAllCourseInfoByIdStub = sinon.stub();
const checkUserPermissionToAccessCourseInfoStub = sinon.stub();
const getActiveStudentUserByIdStub = sinon.stub();
const assignStudentForCourseStub = sinon.stub();

const userIdMock = 'user_Id_Mock';
const coursesIdMock = 'courses_Id_Mock';
const instructorIdMock = 'instructor_Id_Mock';
const studentIdMock = 'student_Id_Mock';
const courseMock = {
  id: coursesIdMock,
  title: 'FL',
  description: 'learn kompuktory',
  generalInformation: ['all information about kompuktory'],
};
const coursesInstructorMock = [
  {
    id: instructorIdMock,
    [DB_CONTRACT.coursesInstructor.coursesReferenceName]: courseMock,
  }];
const coursesStudentMock = [
  {
    id: studentIdMock,
    [DB_CONTRACT.coursesStudent.coursesReferenceName]: courseMock,
  }];

describe('courses.controller.js', () => {
  beforeEach(() => {
    resMock = httpMocks.createResponse();
  });
  afterEach(() => {
    getAllCoursesByInstructorsIdStub.resetHistory();
    getCoursesByStudentIdAndOptionsStub.resetHistory();
    getActiveInstructorUserByIdStub.resetHistory();
    assignInstructorsForCourseStub.resetHistory();
    getAllCourseInfoByIdStub.resetHistory();
    checkUserPermissionToAccessCourseInfoStub.resetHistory();
    getActiveStudentUserByIdStub.resetHistory();
    assignStudentForCourseStub.resetHistory();
  });

  describe('getCoursesByInstructorIdController', () => {
    it('should get courses by instructorId(admin)', async () => {
      reqMock = httpMocks.createRequest({
        params: {
          id: instructorIdMock,
        },
        userId: userIdMock,
        userRole: USER_ROLE.admin,
      });
      const { getCoursesByInstructorIdController } = mockExportedFunction(
        '../../src/controllers/courses.controller.js',
        [
          {
            dependencyPath: '../../src/services/db.service',
            stubs: {
              getAllCoursesByInstructorsId: getAllCoursesByInstructorsIdStub.resolves(coursesInstructorMock),
            },
          },
        ],
      );

      await getCoursesByInstructorIdController(reqMock, resMock);

      expect(getAllCoursesByInstructorsIdStub.calledOnceWithExactly(instructorIdMock))
        .to.be.true;
      expect(resMock).to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData()).to.be.an('object')
        .be.deep.equal(successResultDataMock([courseMock]));
    });

    it('should get courses by instructorId(instructor)', async () => {
      reqMock = httpMocks.createRequest({
        params: {
          id: instructorIdMock,
        },
        userId: instructorIdMock,
        userRole: USER_ROLE.instructor,
      });
      const { getCoursesByInstructorIdController } = mockExportedFunction(
        '../../src/controllers/courses.controller.js',
        [
          {
            dependencyPath: '../../src/services/db.service',
            stubs: {
              getAllCoursesByInstructorsId: getAllCoursesByInstructorsIdStub.resolves(coursesInstructorMock),
            },
          },
        ],
      );

      await getCoursesByInstructorIdController(reqMock, resMock);

      expect(getAllCoursesByInstructorsIdStub.calledOnceWithExactly(instructorIdMock))
        .to.be.true;
      expect(resMock).to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData()).to.be.an('object')
        .be.deep.equal(successResultDataMock([courseMock]));
    });
  });

  describe('getCoursesByStudentIdController', () => {
    it('should get courses by student(admin)', async () => {
      reqMock = httpMocks.createRequest({
        params: {
          id: studentIdMock,
        },
        userId: userIdMock,
        userRole: USER_ROLE.admin,
      });
      const { getCoursesByStudentIdController } = mockExportedFunction(
        '../../src/controllers/courses.controller.js',
        [
          {
            dependencyPath: '../../src/services/db.service',
            stubs: {
              getCoursesByStudentIdAndOptions: getCoursesByStudentIdAndOptionsStub.resolves(coursesStudentMock),
            },
          },
        ],
      );

      await getCoursesByStudentIdController(reqMock, resMock);

      expect(getCoursesByStudentIdAndOptionsStub.calledOnceWithExactly(studentIdMock))
        .to.be.true;
      expect(resMock).to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData()).to.be.an('object')
        .be.deep.equal(successResultDataMock([courseMock]));
    });

    it('should get courses by studentId(student)', async () => {
      reqMock = httpMocks.createRequest({
        params: {
          id: studentIdMock,
        },
        userId: studentIdMock,
        userRole: USER_ROLE.student,
      });
      const { getCoursesByStudentIdController } = mockExportedFunction(
        '../../src/controllers/courses.controller.js',
        [
          {
            dependencyPath: '../../src/services/db.service',
            stubs: {
              getCoursesByStudentIdAndOptions: getCoursesByStudentIdAndOptionsStub.resolves(coursesStudentMock),
            },
          },
        ],
      );

      await getCoursesByStudentIdController(reqMock, resMock);

      expect(getCoursesByStudentIdAndOptionsStub.calledOnceWithExactly(studentIdMock))
        .to.be.true;
      expect(resMock).to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData()).to.be.an('object')
        .be.deep.equal(successResultDataMock([courseMock]));
    });
  });

  describe('assignInstructorsForCourseController', () => {
    it('should assign instructor to courses(admin)', async () => {
      reqMock = httpMocks.createRequest({
        params: {
          courseId: coursesIdMock,
          instructorId: instructorIdMock,
        },
        userId: userIdMock,
        userRole: USER_ROLE.admin,
      });
      const { assignInstructorsForCourseController } = mockExportedFunction(
        '../../src/controllers/courses.controller.js',
        [
          {
            dependencyPath: '../../src/services/courses.service',
            stubs: {
              getAllCourseInfoById: getAllCourseInfoByIdStub.resolves(),
              assignInstructorsForCourse: assignInstructorsForCourseStub.resolves(),
            },
          },
          {
            dependencyPath: '../../src/services/db.service',
            stubs: {
              getActiveInstructorUserById: getActiveInstructorUserByIdStub.resolves(),
            },
          },
        ],
      );

      await assignInstructorsForCourseController(reqMock, resMock);

      expect(getAllCourseInfoByIdStub.calledOnceWithExactly(coursesIdMock))
        .to.be.true;
      expect(getActiveInstructorUserByIdStub.calledOnceWithExactly(instructorIdMock))
        .to.be.true;
      expect(assignInstructorsForCourseStub.calledOnceWithExactly({
        courseId: coursesIdMock,
        instructorId: instructorIdMock,
      }, userIdMock))
        .to.be.true;
      expect(resMock).to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData()).to.be.an('object')
        .be.deep.equal(successResultDataMock());
    });
  });

  describe('assignStudentForCourseController', () => {
    it('should assign student to courses(admin)', async () => {
      reqMock = httpMocks.createRequest({
        params: {
          courseId: coursesIdMock,
          studentId: studentIdMock,
        },
        userId: userIdMock,
        userRole: USER_ROLE.admin,
      });
      const { assignStudentForCourseController } = mockExportedFunction(
        '../../src/controllers/courses.controller.js',
        [
          {
            dependencyPath: '../../src/services/courses.service',
            stubs: {
              getAllCourseInfoById: getAllCourseInfoByIdStub.resolves(),
              assignStudentForCourse: assignStudentForCourseStub.resolves(),
              checkUserPermissionToAccessCourseInfo: checkUserPermissionToAccessCourseInfoStub.resolves(),
            },
          },
          {
            dependencyPath: '../../src/services/db.service',
            stubs: {
              getActiveStudentUserById: getActiveStudentUserByIdStub.resolves(),
            },
          },
        ],
      );

      await assignStudentForCourseController(reqMock, resMock);

      expect(getAllCourseInfoByIdStub.calledOnceWithExactly(coursesIdMock))
        .to.be.true;
      expect(checkUserPermissionToAccessCourseInfoStub.calledOnceWithExactly(USER_ROLE.admin, userIdMock, coursesIdMock))
        .to.be.true;
      expect(getActiveStudentUserByIdStub.calledOnceWithExactly(studentIdMock))
        .to.be.true;
      expect(assignStudentForCourseStub.calledOnceWithExactly({
        courseId: coursesIdMock,
        studentId: studentIdMock,
      }, userIdMock))
        .to.be.true;
      expect(resMock).to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData()).to.be.an('object')
        .be.deep.equal(successResultDataMock());
    });

    it('should assign student to courses(student)', async () => {
      reqMock = httpMocks.createRequest({
        params: {
          courseId: coursesIdMock,
          studentId: studentIdMock,
        },
        userId: studentIdMock,
        userRole: USER_ROLE.student,
      });
      const { assignStudentForCourseController } = mockExportedFunction(
        '../../src/controllers/courses.controller.js',
        [
          {
            dependencyPath: '../../src/services/courses.service',
            stubs: {
              getAllCourseInfoById: getAllCourseInfoByIdStub.resolves(),
              assignStudentForCourse: assignStudentForCourseStub.resolves(),
              checkUserPermissionToAccessCourseInfo: checkUserPermissionToAccessCourseInfoStub.resolves(),
            },
          },
          {
            dependencyPath: '../../src/services/db.service',
            stubs: {
              getActiveStudentUserById: getActiveStudentUserByIdStub.resolves(),
            },
          },
        ],
      );

      await assignStudentForCourseController(reqMock, resMock);

      expect(getAllCourseInfoByIdStub.calledOnceWithExactly(coursesIdMock))
        .to.be.true;
      expect(checkUserPermissionToAccessCourseInfoStub.notCalled)
        .to.be.true;
      expect(getActiveStudentUserByIdStub.calledOnceWithExactly(studentIdMock))
        .to.be.true;
      expect(assignStudentForCourseStub.calledOnceWithExactly({
        courseId: coursesIdMock,
        studentId: studentIdMock,
      }, studentIdMock))
        .to.be.true;
      expect(resMock).to.be.an('object')
        .have.property('statusCode')
        .be.equal(HTTP_STATUS.ok.code);
      expect(resMock._getData()).to.be.an('object')
        .be.deep.equal(successResultDataMock());
    });

    it('should throw ForbiddenError student to courses(student)', async () => {
      reqMock = httpMocks.createRequest({
        params: {
          courseId: coursesIdMock,
          studentId: studentIdMock,
        },
        userId: userIdMock,
        userRole: USER_ROLE.student,
      });
      const { assignStudentForCourseController } = mockExportedFunction(
        '../../src/controllers/courses.controller.js',
        [
          {
            dependencyPath: '../../src/services/courses.service',
            stubs: {
              getAllCourseInfoById: getAllCourseInfoByIdStub.resolves(),
              assignStudentForCourse: assignStudentForCourseStub.resolves(),
              checkUserPermissionToAccessCourseInfo: checkUserPermissionToAccessCourseInfoStub.resolves(),
            },
          },
          {
            dependencyPath: '../../src/services/db.service',
            stubs: {
              getActiveStudentUserById: getActiveStudentUserByIdStub.resolves(),
            },
          },
        ],
      );

      try {
        await assignStudentForCourseController(reqMock, resMock);
      } catch (err) {
        expect(getAllCourseInfoByIdStub.calledOnceWithExactly(coursesIdMock))
          .to.be.true;
        expect(checkUserPermissionToAccessCourseInfoStub.notCalled)
          .to.be.true;
        expect(getActiveStudentUserByIdStub.notCalled)
          .to.be.true;
        expect(assignStudentForCourseStub.notCalled)
          .to.be.true;
        expect(err)
          .to
          .be
          .instanceOf(ForbiddenError)
          .have
          .property('message')
          .contains('You do not have permission for this actions');
      }
    });
  });
});
