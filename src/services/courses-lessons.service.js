const { v4: uuid } = require('uuid');
const { BadRequestError } = require('../error-handler');
const {
  saveLesson,
  updateLessonById,
  removeLessonById,
  getAllLessonsByCourseId,
} = require('./db.service');
const { DB_CONTRACT } = require('../db/db.contract');
const {
  checkDataFromDB,
} = require('../utils');
const { getAllCourseInfoById } = require('./courses.service');
const { COURSE_LESSONS_MIN_COUNT } = require('../constants');

const createLesson = async (lessonData, loggedInUserId) => {
  await getAllCourseInfoById(lessonData.courseId);

  await saveLesson({
    ...lessonData,
    id: uuid(),
    [DB_CONTRACT.common.createdBy.property]: loggedInUserId,
  });
};

const updateLesson = async (id, courseId, lessonData, loggedInUserId) => {
  await getAllCourseInfoById(courseId);

  const result = await updateLessonById(id, courseId, {
    ...lessonData,
    [DB_CONTRACT.common.updatedBy.property]: loggedInUserId,
  });

  checkDataFromDB(result[0]);
};

const deleteLessonById = async (id, courseId) => {
  if (!id || !courseId) {
    throw new BadRequestError('ID or courseId is not provided');
  }

  const lessons = await getAllLessonsByCourseId(courseId);

  checkDataFromDB(lessons);

  if (lessons.length() <= COURSE_LESSONS_MIN_COUNT) {
    throw new BadRequestError(`Each course should have at least ${COURSE_LESSONS_MIN_COUNT} lessons`);
  }

  await removeLessonById(id, courseId);
};

module.exports = {
  createLesson,
  updateLesson,
  deleteLessonById,
};
