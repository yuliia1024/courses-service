// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/services/token.service')];

const { expect } = require('chai');
const sinon = require('sinon');
const { mockExportedFunction } = require('../../test-utils');
const { DB_CONTRACT } = require('../../../src/db/db.contract');
const {
  STUDENT_COURSES_STATUS,
  STUDENT_COURSES_MAX_COUNT,
} = require('../../../src/constants');

const checkDataFromDBStub = sinon.stub();
const checkUserPermissionToAccessCourseInfoStub = sinon.stub();
const createStudentFeedbackStub = sinon.stub();
const getCoursesByStudentIdAndOptionsStub = sinon.stub();
const courseWithLessonsByCourseIdStub = sinon.stub();
const saveCourseInstructorStub = sinon.stub();
const saveCourseStudentStub = sinon.stub();

const userIdMock = 'userId_mock';
const idMock = 'id_mock';
const coursesIdMock = 'courses-Id-Mock';

const courseInstructorDataMock = {
  coursesId: coursesIdMock,
  instructorId: userIdMock,
};
const courseStudentDataMock = {
  coursesId: coursesIdMock,
  studentId: idMock,
};
const courseLessonDataMock = [{
  [DB_CONTRACT.coursesLesson.courseReferenceName]: {
    id: coursesIdMock,
    title: 'FL',
    description: 'learn kompuktory',
    generalInformation: ['all information about kompuktory'],
  },
  title: 'kompuktory 1',
  description: 'learn firs kompuktor',
  information: [
    'information about kompuktory',
  ],
}];
const courseLessonResMock = {
  id: coursesIdMock,
  title: 'FL',
  description: 'learn kompuktory',
  generalInformation: ['all information about kompuktory'],
  lessons: [
    {
      title: 'kompuktory 1',
      description: 'learn firs kompuktor',
      information: [
        'information about kompuktory',
      ],
    },
  ],
};

describe('courses.service.js', () => {
  afterEach(() => {
    checkDataFromDBStub.resetHistory();
    checkUserPermissionToAccessCourseInfoStub.resetHistory();
    getCoursesByStudentIdAndOptionsStub.resetHistory();
    createStudentFeedbackStub.resetHistory();
    courseWithLessonsByCourseIdStub.resetHistory();
    saveCourseInstructorStub.resetHistory();
    saveCourseStudentStub.resetHistory();
  });

  describe('getAllCourseInfoById', () => {
    it('should get course info', async () => {
      const { getAllCourseInfoById } = mockExportedFunction(
        '../../src/services/courses.service.js',
        [
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              courseWithLessonsByCourseId: courseWithLessonsByCourseIdStub.resolves(courseLessonDataMock),
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

      const result = await getAllCourseInfoById(coursesIdMock);

      expect(courseWithLessonsByCourseIdStub
        .calledOnceWithExactly(coursesIdMock))
        .to.be.true;
      expect(checkDataFromDBStub.calledOnce)
        .to.be.true;
      expect(result)
        .to.be.deep.equal(courseLessonResMock);
    });

    it('should throw BadRequestError', async () => {
      const { getAllCourseInfoById } = mockExportedFunction(
        '../../src/services/courses.service.js',
        [
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              courseWithLessonsByCourseId: courseWithLessonsByCourseIdStub.resolves(courseLessonDataMock),
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
        await getAllCourseInfoById(undefined);
      } catch (err) {
        expect(courseWithLessonsByCourseIdStub.notCalled)
          .to.be.true;
        expect(checkDataFromDBStub.notCalled)
          .to.be.true;
        expect(err)
          .have.property('message');
        expect(err.message)
          .to.be.equal('ID is not provided');
      }
    });
  });

  describe('assignInstructorsForCourse', () => {
    it('should assign Instructor to course', async () => {
      const { assignInstructorsForCourse } = mockExportedFunction(
        '../../src/services/courses.service.js',
        [
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              saveCourseInstructor: saveCourseInstructorStub.resolves([1]),
            },
          },
          {
            dependencyPath: '../../src/utils',
            stubs: {
              checkDataFromDB: checkDataFromDBStub.returns(null),
            },
          },
          {
            dependencyPath: 'uuid',
            stubs: {
              v4: sinon.stub().returns(idMock),
            },
          },
        ],
      );

      await assignInstructorsForCourse(courseInstructorDataMock, userIdMock);

      expect(saveCourseInstructorStub
        .calledOnceWithExactly({
          ...courseInstructorDataMock,
          [DB_CONTRACT.common.createdBy.property]: userIdMock,
          id: idMock,
        }))
        .to.be.true;
      expect(checkDataFromDBStub.calledOnce)
        .to.be.true;
    });
  });

  describe('assignStudentForCourse', () => {
    it('should assign student to course', async () => {
      const { assignStudentForCourse } = mockExportedFunction(
        '../../src/services/courses.service.js',
        [
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              saveCourseStudent: saveCourseStudentStub.resolves([1]),
              getCoursesByStudentIdAndOptions: getCoursesByStudentIdAndOptionsStub.resolves([1, 1, 1, 1]),
            },
          },
          {
            dependencyPath: '../../src/utils',
            stubs: {
              checkDataFromDB: checkDataFromDBStub.returns(null),
            },
          },
          {
            dependencyPath: 'uuid',
            stubs: {
              v4: sinon.stub().returns(idMock),
            },
          },
        ],
      );

      await assignStudentForCourse(courseStudentDataMock, userIdMock);

      expect(saveCourseStudentStub
        .calledOnceWithExactly({
          ...courseStudentDataMock,
          [DB_CONTRACT.common.createdBy.property]: userIdMock,
          [DB_CONTRACT.coursesStudent.status.property]: STUDENT_COURSES_STATUS.inProgress,
          id: idMock,
        }))
        .to.be.true;
      expect(getCoursesByStudentIdAndOptionsStub.calledOnceWithExactly(courseStudentDataMock.studentId, {
        [DB_CONTRACT.coursesStudent.status.property]: STUDENT_COURSES_STATUS.inProgress,
      }))
        .to.be.true;
      expect(checkDataFromDBStub.calledOnce)
        .to.be.true;
    });

    it('should throw BadRequestError', async () => {
      const { assignStudentForCourse } = mockExportedFunction(
        '../../src/services/courses.service.js',
        [
          {
            dependencyPath: '../../src/services/db.service.js',
            stubs: {
              saveCourseStudent: saveCourseStudentStub.resolves([1]),
              getCoursesByStudentIdAndOptions: getCoursesByStudentIdAndOptionsStub.resolves([1, 1, 1, 1, 1]),
            },
          },
          {
            dependencyPath: '../../src/utils',
            stubs: {
              checkDataFromDB: checkDataFromDBStub.returns(null),
            },
          },
          {
            dependencyPath: 'uuid',
            stubs: {
              v4: sinon.stub().returns(idMock),
            },
          },
        ],
      );

      try {
        await assignStudentForCourse(courseStudentDataMock, userIdMock);
      } catch (err) {
        expect(saveCourseStudentStub.notCalled)
          .to.be.true;
        expect(getCoursesByStudentIdAndOptionsStub.calledOnceWithExactly(courseStudentDataMock.studentId, {
          [DB_CONTRACT.coursesStudent.status.property]: STUDENT_COURSES_STATUS.inProgress,
        }))
          .to.be.true;
        expect(checkDataFromDBStub.notCalled)
          .to.be.true;
        expect(err)
          .have.property('message');
        expect(err.message)
          .to.be.equal(`Student can take up to ${STUDENT_COURSES_MAX_COUNT} courses at the same time.`);
      }
    });
  });
});
