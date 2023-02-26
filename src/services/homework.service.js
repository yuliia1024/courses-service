const { v4: uuid } = require('uuid');
const { isEmpty } = require('lodash');
const { Op } = require('sequelize');
const { BadRequestError } = require('../error-handler');
const {
  saveHomework,
  deleteHomework,
  getHomeworksByOptions,
  getLessonById,
  getCoursesByStudentIdAndOptions,
  updateHomeworkById,
  getHomeworksByOptionsWithLessonInfo,
  getAllLessonsByCourseId,
  updateCoursesStudentStatus,
} = require('./db.service');
const { DB_CONTRACT } = require('../db/db.contract');
const {
  checkDataFromDB,
  createCustomError,
} = require('../utils');
const { sequelizeInstance } = require('../db');
const {
  STUDENT_COURSES_STATUS,
  COURSE_PASS_MIN_MARK,
  UPLOADING_FILE,
  USER_ROLE,
} = require('../constants');
const { checkUserPermissionToAccessCourseInfo } = require('./courses.service');
const {
  uploadFileS3,
  deleteFileS3,
} = require('./s3.service');

const createHomework = async (data, file, loggedUserId) => {
  const { lessonId, studentId } = data;
  const lesson = await getLessonById(lessonId);

  checkDataFromDB(lesson);

  const studentCourseData = await getCoursesByStudentIdAndOptions(studentId, {
    [DB_CONTRACT.coursesStudent.courseId.property]: lesson.courseId,
    [DB_CONTRACT.coursesStudent.status.property]: STUDENT_COURSES_STATUS.inProgress,
  });

  if (isEmpty(studentCourseData)) {
    throw new BadRequestError('You cannot add homework. Data is incorrect.');
  }

  const transaction = await sequelizeInstance.transaction();
  const id = uuid();
  const filePath = `${UPLOADING_FILE.folders.homework}/${studentId}/${id}`;

  try {
    await saveHomework({
      id,
      studentId,
      [DB_CONTRACT.homework.courseLessonId.property]: lessonId,
      filePath,
      [DB_CONTRACT.common.createdBy.property]: loggedUserId,
    }, transaction);

    await uploadFileS3(filePath, file.buffer, file.mimetype);

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();

    throw createCustomError(err);
  }
};

const removeHomework = async (id, studentId) => {
  const transaction = await sequelizeInstance.transaction();
  const homework = getHomeworksByOptions({
    id,
    studentId,
  });

  checkDataFromDB(homework);

  try {
    await deleteFileS3(homework.filePath);

    await deleteHomework(id, transaction);

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();

    throw createCustomError(err);
  }
};

const markHomework = async (id, data, loggedInUserId, userRole) => {
  const lesson = await getLessonById(data.courseLessonId);

  await checkUserPermissionToAccessCourseInfo(userRole, loggedInUserId, lesson.courseId);

  const transaction = await sequelizeInstance.transaction();

  try {
    await updateHomeworkById(id, {
      [DB_CONTRACT.homework.mark.property]: data.mark,
      [DB_CONTRACT.common.createdBy.property]: loggedInUserId,
    }, transaction);

    const homework = await getHomeworksByOptionsWithLessonInfo({
      studentId: data.studentId,
      [DB_CONTRACT.homework.mark.property]: {
        [Op.not]: null,
      },
      [`$${DB_CONTRACT.homework.courseLessonReferenceName}.courseId$`]: lesson.courseId,
    });

    const lessons = await getAllLessonsByCourseId(lesson.courseId);

    if (homework.length === lessons.length) {
      const totalMark = 0;

      homework.map(item => totalMark + item.mark);

      const status = totalMark / homework.length >= COURSE_PASS_MIN_MARK ? STUDENT_COURSES_STATUS.passed : STUDENT_COURSES_STATUS.rejected;

      await updateCoursesStudentStatus(data.studentId, lesson.courseId, status, transaction);
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();

    throw createCustomError(err);
  }
};

const updateHomework = async req => {
  const homework = await getHomeworksByOptions({
    ...(req.userRole === USER_ROLE.student && { studentId: req.userId }),
    [DB_CONTRACT.homework.mark.property]: {
      [Op.not]: null,
    },
    id: req.params.id,
  });

  checkDataFromDB(homework);

  const transaction = await sequelizeInstance.transaction();

  try {
    const file = req[UPLOADING_FILE.fieldName];

    await updateHomeworkById(req.params.id, {
      [DB_CONTRACT.common.createdBy.property]: req.userId,
    });

    await uploadFileS3(homework.filePath, file.buffer, file.mimetype);

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();

    throw createCustomError(err);
  }
};

module.exports = {
  createHomework,
  removeHomework,
  markHomework,
  updateHomework,
};
