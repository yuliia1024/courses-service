const { v4: uuid } = require('uuid');
const { isEmpty } = require('lodash');
const { BadRequestError,
  ForbiddenError } = require('../error-handler');
const {
  saveCourse,
  updateCourseById,
  courseWithLessonsByCourseId,
  removeCourseById,
  saveCourseInstructor,
  saveCourseLessons,
  getAllCoursesByOptions,
  getCourseInstructorsByOptions,
  saveCourseStudent,
} = require('./db.service');
const { DB_CONTRACT } = require('../db/db.contract');
const { sequelizeInstance } = require('../db');
const {
  createCustomError,
  checkDataFromDB,
  createOrderParameters,
} = require('../utils');
const {
  createPaginateOptions,
  createDataObjectWithPaginationInfo,
} = require('../utils/pagination');
const { USER_ROLE } = require('../constants');

const createCourse = async req => {
  const transaction = await sequelizeInstance.transaction();
  const courseId = uuid();

  try {
    await saveCourse({
      ...req.body,
      id: courseId,
      [DB_CONTRACT.common.createdBy.property]: req.userId,
    }, transaction);

    const coursesLessonsData = req.body.lessons.map(item => ({
      ...item,
      id: uuid(),
      [DB_CONTRACT.coursesLesson.courseId.property]: courseId,
      [DB_CONTRACT.common.createdBy.property]: req.userId,
    }));

    await saveCourseLessons(coursesLessonsData, transaction);

    const coursesInstructorData = req.body.instructors.map(item => ({
      ...item,
      id: uuid(),
      [DB_CONTRACT.coursesLesson.courseId.property]: courseId,
      [DB_CONTRACT.common.createdBy.property]: req.userId,
    }));

    await saveCourseInstructor(coursesInstructorData, transaction);

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();

    throw createCustomError(err);
  }
};

const updateCourse = async (id, loggedInUserId, data) => {
  const dataObject = {
    ...data,
    [DB_CONTRACT.common.updatedBy.property]: loggedInUserId,
  };

  const result = await updateCourseById(id, dataObject);

  checkDataFromDB(result[0]);
};

const deleteCourseById = async id => {
  if (!id) {
    throw new BadRequestError('ID is not provided');
  }

  await removeCourseById(id);
};

const getAllCourseInfoById = async id => {
  if (!id) {
    throw new BadRequestError('ID is not provided');
  }

  const lessonsData = await courseWithLessonsByCourseId(id);

  checkDataFromDB(lessonsData);

  return {
    ...lessonsData[0][DB_CONTRACT.coursesLesson.courseReferenceName],
    lessons: lessonsData.map(item => item.omit([DB_CONTRACT.coursesLesson.courseReferenceName])),
  };
};

const getAllCourses = async data => {
  try {
    const {
      offset,
      limit,
      orderBy,
      orderDirection,
    } = data;

    const order = createOrderParameters(orderBy, orderDirection);

    const options = createPaginateOptions(offset, limit, order);

    const {
      count,
      rows,
    } = await getAllCoursesByOptions(options);

    return createDataObjectWithPaginationInfo(offset, limit, count, rows);
  } catch (err) {
    throw createCustomError(err);
  }
};

const assignInstructorsForCourse = async (data, loggedUserId) => {
  const coursesInstructorData = data.instructors.map(item => ({
    ...item,
    [DB_CONTRACT.common.createdBy.property]: loggedUserId,
    id: uuid(),
  }));

  const result = await saveCourseInstructor(coursesInstructorData);

  checkDataFromDB(result[0]);
};

const assignStudentForCourse = async (data, loggedUserId) => {
  const coursesStudentData = data.instructors.map(item => ({
    ...item,
    [DB_CONTRACT.common.createdBy.property]: loggedUserId,
    id: uuid(),
  }));

  const result = await saveCourseStudent(coursesStudentData);

  checkDataFromDB(result[0]);
};

const checkUserPermissionToModifyCourseInfo = async (role, userId, courseId) => {
  if (role !== USER_ROLE.admin) {
    const instructor = await getCourseInstructorsByOptions({
      courseId,
      [DB_CONTRACT.coursesInstructor.instructorId]: userId,
    });

    if (isEmpty(instructor)) {
      throw ForbiddenError('You dont have permission for this action');
    }
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourseById,
  getAllCourseInfoById,
  getAllCourses,
  assignInstructorsForCourse,
  checkUserPermissionToModifyCourseInfo,
  assignStudentForCourse,
};