// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/services/token.service')];

const { expect } = require('chai');
const sinon = require('sinon');
const { Op } = require('sequelize');
const { mockExportedFunction } = require('../../test-utils');
const { STUDENT_COURSES_STATUS,
  USER_ROLE } = require('../../../src/constants');
const { DB_CONTRACT } = require('../../../src/db/db.contract');
const { sequelizeInstance } = require('../../../src/db');
const { BadRequestError } = require('../../../src/error-handler');

const checkDataFromDBStub = sinon.stub();
const uploadFileS3Stub = sinon.stub();
const saveHomeworkStub = sinon.stub();
const getLessonByIdStub = sinon.stub();
const getCoursesByStudentIdAndOptionsStub = sinon.stub();
const transactionCommitStub = sinon.stub();
const transactionRollbackStub = sinon.stub();
const createCustomErrorStub = sinon.stub();
const checkUserPermissionToAccessCourseInfoStub = sinon.stub();
const updateHomeworkByIdStub = sinon.stub();
const getHomeworksByOptionsWithLessonInfoStub = sinon.stub();
const getAllLessonsByCourseIdStub = sinon.stub();
const updateCoursesStudentStatusStub = sinon.stub();

let sequelizeInstanceMock;

const transactionMockResult = {
  commit: transactionCommitStub,
  rollback: transactionRollbackStub,
};
const userIdMock = 'userId_mock';
const homeworkDataMock = {
  studentId: 'student-Id',
  lessonId: 'some id',
};
const lessonsHomeworkMock = [{ mark: 80 }, { mark: 80 }, { mark: 70 }, { mark: 100 }];
const lessonsHomeworkRejectMock = [{ mark: 10 }, { mark: 50 }, { mark: 70 }, { mark: 15 }, { mark: 34 }];
const fileMock = {
  buffer: '',
  mimetype: 'pdf',
};
const idMock = 'some-id-mock';

describe('homework.service.js', () => {
  beforeEach(() => {
    sequelizeInstanceMock = sinon.mock(sequelizeInstance);
  });
  afterEach(() => {
    createCustomErrorStub.resetHistory();
    sequelizeInstanceMock.restore();
    transactionCommitStub.resetHistory();
    transactionRollbackStub.resetHistory();
    checkDataFromDBStub.resetHistory();
    uploadFileS3Stub.resetHistory();
    saveHomeworkStub.resetHistory();
    getLessonByIdStub.resetHistory();
    checkUserPermissionToAccessCourseInfoStub.resetHistory();
    getCoursesByStudentIdAndOptionsStub.resetHistory();
    updateHomeworkByIdStub.resetHistory();
    getHomeworksByOptionsWithLessonInfoStub.resetHistory();
    getAllLessonsByCourseIdStub.resetHistory();
    updateCoursesStudentStatusStub.resetHistory();
  });

  describe('createHomework', () => {
    it('should create homework', async () => {
      const { createHomework } = mockExportedFunction(
        '../../src/services/homework.service.js',
        [
          {
            dependencyPath: '../../src/services/s3.service.js',
            stubs: {
              uploadFileS3: uploadFileS3Stub.resolves(),
            },
          },
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              saveHomework: saveHomeworkStub.resolves([1]),
              getCoursesByStudentIdAndOptions: getCoursesByStudentIdAndOptionsStub.resolves([1]),
              getLessonById: getLessonByIdStub.resolves({ courseId: 'course-Id' }),
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

      sequelizeInstanceMock.expects('transaction')
        .once()
        .resolves(transactionMockResult);

      await createHomework(homeworkDataMock, fileMock, userIdMock);

      expect(getLessonByIdStub
        .calledOnceWithExactly(homeworkDataMock.lessonId))
        .to.be.true;
      expect(getCoursesByStudentIdAndOptionsStub.calledOnceWithExactly(homeworkDataMock.studentId, {
        courseId: 'course-Id',
        [DB_CONTRACT.coursesStudent.status.property]: STUDENT_COURSES_STATUS.inProgress,
      }))
        .to.be.true;
      expect(checkDataFromDBStub.calledOnceWithExactly({ courseId: 'course-Id' }))
        .to.be.true;
      expect(saveHomeworkStub.calledOnce)
        .to.be.true;
      expect(uploadFileS3Stub.calledOnce)
        .to.be.true;
      expect(transactionCommitStub.calledOnce)
        .to.be.true;
      expect(transactionRollbackStub.notCalled)
        .to.be.true;
      expect(createCustomErrorStub.notCalled)
        .to.be.true;

      sequelizeInstanceMock.verify();
    });

    it('should throw BadRequestError', async () => {
      const { createHomework } = mockExportedFunction(
        '../../src/services/homework.service.js',
        [
          {
            dependencyPath: '../../src/services/s3.service.js',
            stubs: {
              uploadFileS3: uploadFileS3Stub.resolves(),
            },
          },
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              saveHomework: saveHomeworkStub.resolves([1]),
              getCoursesByStudentIdAndOptions: getCoursesByStudentIdAndOptionsStub.resolves([]),
              getLessonById: getLessonByIdStub.resolves({ courseId: 'course-Id' }),
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

      try {
        await createHomework(homeworkDataMock, fileMock, userIdMock);
      } catch (err) {
        expect(getLessonByIdStub
          .calledOnceWithExactly(homeworkDataMock.lessonId))
          .to.be.true;
        expect(getCoursesByStudentIdAndOptionsStub.calledOnceWithExactly(homeworkDataMock.studentId, {
          courseId: 'course-Id',
          [DB_CONTRACT.coursesStudent.status.property]: STUDENT_COURSES_STATUS.inProgress,
        }))
          .to.be.true;
        expect(checkDataFromDBStub.calledOnceWithExactly({ courseId: 'course-Id' }))
          .to.be.true;
        expect(saveHomeworkStub.notCalled)
          .to.be.true;
        expect(uploadFileS3Stub.notCalled)
          .to.be.true;
        expect(transactionCommitStub.notCalled)
          .to.be.true;
        expect(transactionRollbackStub.notCalled)
          .to.be.true;
        expect(createCustomErrorStub.notCalled)
          .to.be.true;
        expect(err)
          .to.be.instanceOf(BadRequestError)
          .have.property('message')
          .contains('incorrect');
      }
    });

    it('should throw createCustomError()', async () => {
      const { createHomework } = mockExportedFunction(
        '../../src/services/homework.service.js',
        [
          {
            dependencyPath: '../../src/services/s3.service.js',
            stubs: {
              uploadFileS3: uploadFileS3Stub.rejects({ err: 'error' }),
            },
          },
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              saveHomework: saveHomeworkStub.resolves([1]),
              getCoursesByStudentIdAndOptions: getCoursesByStudentIdAndOptionsStub.resolves([1]),
              getLessonById: getLessonByIdStub.resolves({ courseId: 'course-Id' }),
            },
          },
          {
            dependencyPath: '../../src/utils',
            stubs: {
              checkDataFromDB: checkDataFromDBStub.returns(null),
              createCustomError: createCustomErrorStub.returns(null),
            },
          },
        ],
      );

      sequelizeInstanceMock.expects('transaction')
        .once()
        .resolves(transactionMockResult);

      try {
        await createHomework(homeworkDataMock, fileMock, userIdMock);
      } catch (err) {
        expect(getLessonByIdStub
          .calledOnceWithExactly(homeworkDataMock.lessonId))
          .to.be.true;
        expect(getCoursesByStudentIdAndOptionsStub.calledOnceWithExactly(homeworkDataMock.studentId, {
          courseId: 'course-Id',
          [DB_CONTRACT.coursesStudent.status.property]: STUDENT_COURSES_STATUS.inProgress,
        }))
          .to.be.true;
        expect(checkDataFromDBStub.calledOnceWithExactly({ courseId: 'course-Id' }))
          .to.be.true;
        expect(saveHomeworkStub.calledOnce)
          .to.be.true;
        expect(uploadFileS3Stub.calledOnce)
          .to.be.true;
        expect(transactionCommitStub.notCalled)
          .to.be.true;
        expect(transactionRollbackStub.calledOnce)
          .to.be.true;
        expect(createCustomErrorStub.calledOnceWithExactly({ err: 'error' }))
          .to.be.true;
      }
      sequelizeInstanceMock.verify();
    });
  });

  describe('markHomework', () => {
    it('should mark homework', async () => {
      const { markHomework } = mockExportedFunction(
        '../../src/services/homework.service.js',
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
              updateHomeworkById: updateHomeworkByIdStub.resolves(),
              updateCoursesStudentStatus: updateCoursesStudentStatusStub.resolves(),
              getHomeworksByOptionsWithLessonInfo: getHomeworksByOptionsWithLessonInfoStub.resolves(lessonsHomeworkMock),
              getLessonById: getLessonByIdStub.resolves({ courseId: 'course-Id' }),
              getAllLessonsByCourseId: getAllLessonsByCourseIdStub.resolves({ courseId: 'course-Id' }),
            },
          },
          {
            dependencyPath: '../../src/utils',
            stubs: {
              createCustomError: createCustomErrorStub.returns(null),
            },
          },
        ],
      );

      sequelizeInstanceMock.expects('transaction')
        .once()
        .resolves(transactionMockResult);

      await markHomework(idMock, homeworkDataMock, userIdMock, USER_ROLE.instructor);

      expect(getLessonByIdStub
        .calledOnceWithExactly(homeworkDataMock.courseLessonId))
        .to.be.true;
      expect(checkUserPermissionToAccessCourseInfoStub
        .calledOnceWithExactly(USER_ROLE.instructor, userIdMock, 'course-Id'))
        .to.be.true;
      expect(updateHomeworkByIdStub.calledOnce)
        .to.be.true;
      expect(getHomeworksByOptionsWithLessonInfoStub.calledOnceWithExactly({
        studentId: homeworkDataMock.studentId,
        [DB_CONTRACT.homework.mark.property]: {
          [Op.not]: null,
        },
        [`$${DB_CONTRACT.homework.courseLessonReferenceName}.${DB_CONTRACT.coursesLesson.courseId.column}$`]: 'course-Id',
      }))
        .to.be.true;
      expect(getAllLessonsByCourseIdStub.calledOnceWithExactly('course-Id'))
        .to.be.true;
      expect(transactionCommitStub.calledOnce)
        .to.be.true;
      expect(transactionRollbackStub.notCalled)
        .to.be.true;
      expect(updateCoursesStudentStatusStub.notCalled)
        .to.be.true;
      expect(createCustomErrorStub.notCalled)
        .to.be.true;

      sequelizeInstanceMock.verify();
    });
    it('should throw createCustomError()', async () => {
      const { markHomework } = mockExportedFunction(
        '../../src/services/homework.service.js',
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
              updateHomeworkById: updateHomeworkByIdStub.resolves(),
              updateCoursesStudentStatus: updateCoursesStudentStatusStub.rejects({ err: 'error' }),
              getHomeworksByOptionsWithLessonInfo: getHomeworksByOptionsWithLessonInfoStub.resolves(lessonsHomeworkRejectMock),
              getLessonById: getLessonByIdStub.resolves({ courseId: 'course-Id' }),
              getAllLessonsByCourseId: getAllLessonsByCourseIdStub.resolves({ courseId: 'course-Id' }),
            },
          },
          {
            dependencyPath: '../../src/utils',
            stubs: {
              createCustomError: createCustomErrorStub.returns(null),
            },
          },
        ],
      );

      sequelizeInstanceMock.expects('transaction')
        .once()
        .resolves(transactionMockResult);
      try {
        await markHomework(idMock, homeworkDataMock, userIdMock, USER_ROLE.instructor);
      } catch (err) {
        expect(getLessonByIdStub
          .calledOnceWithExactly(homeworkDataMock.courseLessonId))
          .to.be.true;
        expect(checkUserPermissionToAccessCourseInfoStub
          .calledOnceWithExactly(USER_ROLE.instructor, userIdMock, 'course-Id'))
          .to.be.true;
        expect(updateHomeworkByIdStub.calledOnce)
          .to.be.true;
        expect(getHomeworksByOptionsWithLessonInfoStub.calledOnceWithExactly({
          studentId: homeworkDataMock.studentId,
          [DB_CONTRACT.homework.mark.property]: {
            [Op.not]: null,
          },
          [`$${DB_CONTRACT.homework.courseLessonReferenceName}.${DB_CONTRACT.coursesLesson.courseId.column}$`]: 'course-Id',
        }))
          .to.be.true;
        expect(getAllLessonsByCourseIdStub.calledOnceWithExactly('course-Id'))
          .to.be.true;
        expect(transactionCommitStub.notCalled)
          .to.be.true;
        expect(transactionRollbackStub.calledOnce)
          .to.be.true;
        expect(updateCoursesStudentStatusStub.calledOnce)
          .to.be.true;
        expect(createCustomErrorStub.calledOnceWithExactly({ err: 'error' }))
          .to.be.true;
      }

      sequelizeInstanceMock.verify();
    });
  });
});
