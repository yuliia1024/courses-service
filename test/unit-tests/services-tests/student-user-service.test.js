// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/services/token.service')];

const { expect } = require('chai');
const sinon = require('sinon');
const { mockExportedFunction } = require('../../test-utils');
const {
  USER_ROLE,
  STUDENT_COURSES_STATUS,
} = require('../../../src/constants');
const { DB_CONTRACT } = require('../../../src/db/db.contract');

const checkDataFromDBStub = sinon.stub();
const checkUserPermissionToAccessCourseInfoStub = sinon.stub();
const getCoursesByStudentIdAndOptionsStub = sinon.stub();
const createStudentFeedbackStub = sinon.stub();

const userIdMock = 'userId_mock';
const addStudentFeedbackDataMock = {
  userId: userIdMock,
  body: {
    feedback: 'nice',
    studentId: 'student-Id',
    courseId: 'some id',
  },
  role: USER_ROLE.admin,
};

describe('student-user.service.js', () => {
  afterEach(() => {
    checkDataFromDBStub.resetHistory();
    checkUserPermissionToAccessCourseInfoStub.resetHistory();
    getCoursesByStudentIdAndOptionsStub.resetHistory();
    createStudentFeedbackStub.resetHistory();
  });

  describe('addStudentFeedback', () => {
    it('should create student feedback', async () => {
      const { addStudentFeedback } = mockExportedFunction(
        '../../src/services/student-user.service.js',
        [
          {
            dependencyPath: '../../src/services/courses.service.js',
            stubs: {
              checkUserPermissionToAccessCourseInfo: checkUserPermissionToAccessCourseInfoStub.resolves(),
            },
          },
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              getCoursesByStudentIdAndOptions: getCoursesByStudentIdAndOptionsStub.resolves([1]),
              createStudentFeedback: createStudentFeedbackStub.resolves([1]),
            },
          },
          {
            dependencyPath: '../../src/utils',
            stubs: {
              checkDataFromDB: checkDataFromDBStub.returns(null),
            },
          },
        ],
      );

      await addStudentFeedback(addStudentFeedbackDataMock.body, USER_ROLE.instructor, userIdMock);

      expect(checkUserPermissionToAccessCourseInfoStub
        .calledOnceWithExactly(USER_ROLE.instructor, userIdMock, addStudentFeedbackDataMock.body.courseId))
        .to.be.true;
      expect(getCoursesByStudentIdAndOptionsStub.calledOnceWithExactly(addStudentFeedbackDataMock.body.studentId, {
        courseId: addStudentFeedbackDataMock.body.courseId,
        [DB_CONTRACT.coursesStudent.status.property]: STUDENT_COURSES_STATUS.passed,
      }))
        .to.be.true;
      expect(checkDataFromDBStub.calledOnce)
        .to.be.true;
      expect(createStudentFeedbackStub.calledOnce)
        .to.be.true;
    });
  });
});
