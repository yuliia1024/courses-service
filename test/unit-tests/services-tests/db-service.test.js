// it is necessary to clear cache for this testing component
delete require.cache[require.resolve('../../../src/services/db.service')];

const sinon = require('sinon');
const Sequelize = require('sequelize');
const { expect } = require('chai');
const { DB_CONTRACT } = require('../../../src/db/db.contract');
const {
  refreshTokenModel,
  coursesInstructorModel,
  coursesModel,
  coursesStudentModel,
  instructorUserModel,
  studentUserModel,
  coursesLessonModel,
  feedbackModel,
  homeworkModel,
} = require('../../../src/db');
const {
  saveRefreshToken,
  removeRefreshTokenByUserId,
  removeRefreshTokenByTokens,
  removeRefreshTokensByArrayUsersIds,
  getCoursesByStudentIdAndOptions,
  getAllCoursesByInstructorsId,
  saveCourseInstructor,
  saveCourseStudent,
  courseWithLessonsByCourseId,
  getCourseInstructorsByOptions,
  createStudentFeedback,
  saveInstructorUser,
  saveHomework,
  updateHomeworkById,
} = require('../../../src/services/db.service');
const { mockExportedFunction } = require('../../test-utils');
const { createOrderParameters } = require('../../../src/utils');

let refreshTokenModelMock;
let coursesInstructorModelMock;
let coursesStudentModelMock;
let instructorUserModelMock;
let studentUserModelMock;
let coursesLessonModelMock;
let feedbackModelMock;
let homeworkModelMock;

const checkDataFromDBStub = sinon.stub();

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
const instructorIdMock = 'instructor_Id_Mock';
const studentIdMock = 'student_Id_Mock';
const idMock = 'id_Mock';
const courseIdMock = 'course_Id_Mock';
const coursesInstructorMock = {
  id: idMock,
  courseId: courseIdMock,
  instructorId: instructorIdMock,
};
const coursesStudentMock = {
  id: idMock,
  courseId: courseIdMock,
  studentId: studentIdMock,
};
const instructorMock = {
  id: instructorIdMock,
  firstName: 'intsr',
  lastName: 'student',
  email: 'byjfufzoufxdrgujlj@kvhrw.com',
};
const homeworkMock = {
  id: idMock,
  filePath: '/filePath',
};

describe('db.service.js', () => {
  beforeEach(() => {
    refreshTokenModelMock = sinon.mock(refreshTokenModel);
    coursesInstructorModelMock = sinon.mock(coursesInstructorModel);
    coursesStudentModelMock = sinon.mock(coursesStudentModel);
    instructorUserModelMock = sinon.mock(instructorUserModel);
    studentUserModelMock = sinon.mock(studentUserModel);
    coursesLessonModelMock = sinon.mock(coursesLessonModel);
    feedbackModelMock = sinon.mock(feedbackModel);
    homeworkModelMock = sinon.mock(homeworkModel);
  });
  afterEach(() => {
    checkDataFromDBStub.resetHistory();
    refreshTokenModelMock.restore();
    coursesInstructorModelMock.restore();
    coursesStudentModelMock.restore();
    instructorUserModelMock.restore();
    studentUserModelMock.restore();
    coursesLessonModelMock.restore();
    feedbackModelMock.restore();
    homeworkModelMock.restore();
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

  describe('getAllCoursesByInstructorsId', () => {
    it('should get courses with instructor', async () => {
      coursesInstructorModelMock
        .expects('findAll')
        .withArgs({
          where: { instructorId: instructorIdMock },
          include: [{ model: coursesModel,
            required: true,
            as: DB_CONTRACT.coursesInstructor.coursesReferenceName,
            attributes: {
              exclude: [
                DB_CONTRACT.common.createdAt.property,
                DB_CONTRACT.common.updatedAt.property,
                DB_CONTRACT.common.createdBy.property,
                DB_CONTRACT.common.updatedBy.property,
              ],
            } }],
          raw: true,
          nest: true,
        })
        .once()
        .resolves();

      await getAllCoursesByInstructorsId(instructorIdMock);

      coursesInstructorModelMock.verify();
    });
  });

  describe('getCoursesByStudentIdAndOptions', () => {
    it('should get courses with student', async () => {
      coursesStudentModelMock
        .expects('findAll')
        .withArgs({
          where: { studentId: studentIdMock },
          include: [{
            model: coursesModel,
            required: true,
            as: DB_CONTRACT.coursesStudent.coursesReferenceName,
            attributes: {
              exclude: [
                DB_CONTRACT.common.createdAt.property,
                DB_CONTRACT.common.updatedAt.property,
                DB_CONTRACT.common.createdBy.property,
                DB_CONTRACT.common.updatedBy.property,
              ],
            },
          }],
          raw: true,
          nest: true,
          attributes: {
            exclude: [
              DB_CONTRACT.common.createdAt.property,
              DB_CONTRACT.common.updatedAt.property,
              DB_CONTRACT.common.createdBy.property,
              DB_CONTRACT.common.updatedBy.property,
            ],
          },
        })
        .once()
        .resolves();

      await getCoursesByStudentIdAndOptions(studentIdMock, {});

      coursesStudentModelMock.verify();
    });
  });

  describe('getActiveInstructorUserById', () => {
    it('should get instructor data by ID', async () => {
      const { getActiveInstructorUserById } = mockExportedFunction(
        '../../src/services/db.service',
        [
          {
            dependencyPath: '../../src/utils',
            stubs: {
              checkDataFromDB: checkDataFromDBStub.returns(null),
            },
          },
        ],
      );

      instructorUserModelMock
        .expects('findByPk')
        .withArgs(
          instructorIdMock,
          {
            raw: true,
            nest: true,
            attributes: {
              exclude: [
                DB_CONTRACT.common.createdAt.property,
                DB_CONTRACT.common.updatedAt.property,
                DB_CONTRACT.common.createdBy.property,
                DB_CONTRACT.common.updatedBy.property,
                DB_CONTRACT.instructorUser.hashPassword.property,
              ],
            },
          }
        )
        .once()
        .resolves({ isActive: true });

      await getActiveInstructorUserById(instructorIdMock);

      expect(checkDataFromDBStub.calledOnce)
        .to.be.true;

      instructorUserModelMock.verify();
    });
  });

  describe('getActiveStudentUserById', () => {
    it('should get student data by ID', async () => {
      const { getActiveStudentUserById } = mockExportedFunction(
        '../../src/services/db.service',
        [
          {
            dependencyPath: '../../src/utils',
            stubs: {
              checkDataFromDB: checkDataFromDBStub.returns(null),
            },
          },
        ],
      );

      studentUserModelMock
        .expects('findByPk')
        .withArgs(
          studentIdMock,
          {
            raw: true,
            nest: true,
            attributes: {
              exclude: [
                DB_CONTRACT.common.createdAt.property,
                DB_CONTRACT.common.updatedAt.property,
                DB_CONTRACT.common.createdBy.property,
                DB_CONTRACT.common.updatedBy.property,
                DB_CONTRACT.studentUser.hashPassword.property,
              ],
            },
          }
        )
        .once()
        .resolves({ isActive: true });

      await getActiveStudentUserById(studentIdMock);

      expect(checkDataFromDBStub.calledOnce)
        .to.be.true;

      studentUserModelMock.verify();
    });
  });

  describe('saveCourseInstructor', () => {
    it('should save course - instructor relation', async () => {
      coursesInstructorModelMock
        .expects('bulkCreate')
        .withArgs([coursesInstructorMock])
        .once()
        .resolves(coursesInstructorModel);

      await saveCourseInstructor(coursesInstructorMock, {});

      coursesInstructorModelMock.verify();
    });
  });

  describe('saveCourseStudent', () => {
    it('should save student - course relation', async () => {
      coursesStudentModelMock
        .expects('bulkCreate')
        .withArgs([coursesStudentMock])
        .once()
        .resolves(coursesStudentModel);

      await saveCourseStudent(coursesStudentMock, {});

      coursesStudentModelMock.verify();
    });
  });

  describe('getStudentIdsByOption', () => {
    it('should get student ids by options', async () => {
      const { getStudentIdsByOption } = mockExportedFunction(
        '../../src/services/db.service',
      );

      coursesStudentModelMock
        .expects('findAll')
        .withArgs(
          {
            raw: true,
            nest: true,
            where: {
              studentId: studentIdMock,
            },
          }
        )
        .once()
        .resolves([coursesStudentMock]);

      const result = await getStudentIdsByOption({ studentId: studentIdMock });

      expect(result)
        .to.be.deep.equal([studentIdMock]);

      coursesStudentModelMock.verify();
    });
  });

  describe('courseWithLessonsByCourseId', () => {
    it('should save student - course relation', async () => {
      coursesLessonModelMock
        .expects('findAll')
        .withArgs({
          raw: true,
          nest: true,
          order: createOrderParameters(DB_CONTRACT.coursesLesson.lessonNumber.property),
          where: { courseId: courseIdMock },
          include: [{
            model: coursesModel,
            required: true,
            as: DB_CONTRACT.coursesLesson.courseReferenceName,
            attributes: {
              exclude: [
                DB_CONTRACT.common.createdAt.property,
                DB_CONTRACT.common.updatedAt.property,
                DB_CONTRACT.common.createdBy.property,
                DB_CONTRACT.common.updatedBy.property,
              ],
            },

          }],
          attributes: {
            exclude: [
              DB_CONTRACT.common.createdAt.property,
              DB_CONTRACT.common.updatedAt.property,
              DB_CONTRACT.common.createdBy.property,
              DB_CONTRACT.common.updatedBy.property,
            ],
          },
        })
        .once()
        .resolves(coursesLessonModel);

      await courseWithLessonsByCourseId(courseIdMock, {});

      coursesLessonModelMock.verify();
    });
  });

  describe('getCourseInstructorsByOptions', () => {
    it('should save student - course relation', async () => {
      coursesInstructorModelMock
        .expects('findAll')
        .withArgs({
          where: {
            courseId: courseIdMock,
            instructorId: instructorIdMock,
          },
        })
        .once()
        .resolves(coursesInstructorModel);

      await getCourseInstructorsByOptions({
        courseId: courseIdMock,
        instructorId: instructorIdMock,
      });

      coursesInstructorModelMock.verify();
    });
  });

  describe('createStudentFeedback', () => {
    it('should create student feedback', async () => {
      feedbackModelMock
        .expects('create')
        .withArgs({
          courseId: courseIdMock,
          studentId: studentIdMock,
        }, { transaction: {} })
        .once()
        .resolves(feedbackModel);

      await createStudentFeedback({
        courseId: courseIdMock,
        studentId: studentIdMock,
      }, {});

      feedbackModelMock.verify();
    });
  });

  describe('saveInstructorUser', () => {
    it('should create student feedback', async () => {
      instructorUserModelMock
        .expects('create')
        .withArgs(instructorMock, { transaction: {} })
        .once()
        .resolves(instructorUserModel);

      await saveInstructorUser(instructorMock, {});

      instructorUserModelMock.verify();
    });
  });

  describe('saveHomework', () => {
    it('should create homework', async () => {
      homeworkModelMock
        .expects('create')
        .withArgs(homeworkMock, { transaction: {} })
        .once()
        .resolves(homeworkModel);

      await saveHomework(homeworkMock, {});

      homeworkModelMock.verify();
    });
  });

  describe('updateHomeworkById', () => {
    it('should update homework and set mark', async () => {
      homeworkModelMock
        .expects('update')
        .withArgs(
          { mark: 90 }, {
            where: { id: idMock },
            transaction: {},
          }
        )
        .once()
        .resolves(homeworkModel);

      await updateHomeworkById(idMock, { mark: 90 }, {});

      homeworkModelMock.verify();
    });
  });
});
