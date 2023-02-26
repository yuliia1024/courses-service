const { SuccessResponse } = require('../custom-response');
const {
  getLessonById,
  getAllLessonsByCourseId,
} = require('../services/db.service');
const {
  createLesson,
  updateLesson,
  deleteLessonById,
} = require('../services/courses-lessons.service');
const { BadRequestError } = require('../error-handler');
const {
  checkDataFromDB,
} = require('../utils');
const { checkUserPermissionToAccessCourseInfo } = require('../services/courses.service');

const createLessonController = async (req, res) => {
  await checkUserPermissionToAccessCourseInfo(req.userRole, req.userId, req.params.courseId);
  await createLesson({
    ...req.body,
    courseId: req.params.courseId,
  }, req.userId);

  new SuccessResponse(res).send();
};

const updateLessonController = async (req, res) => {
  await checkUserPermissionToAccessCourseInfo(req.userRole, req.userId, req.params.courseId);
  await updateLesson(req.params.id, req.params.courseId, req.body, req.userId);

  new SuccessResponse(res).send();
};

const getLessonByIdController = async (req, res) => {
  if (!req.params.id || !req.params.courseId) {
    throw new BadRequestError('ID or courseId is not provided');
  }

  const lessonsData = await getLessonById(req.params.id, req.params.courseId);

  checkDataFromDB(lessonsData);

  new SuccessResponse(res).send(lessonsData);
};

const getAllLessonByCourseController = async (req, res) => {
  const studentUser = await getAllLessonsByCourseId(req.params.courseId);

  new SuccessResponse(res).send(studentUser);
};

const deleteLessonController = async (req, res) => {
  await checkUserPermissionToAccessCourseInfo(req.userRole, req.userId, req.params.courseId);
  await deleteLessonById(req.params.id, req.params.courseId);

  new SuccessResponse(res).send();
};

module.exports = {
  createLessonController,
  updateLessonController,
  getLessonByIdController,
  getAllLessonByCourseController,
  deleteLessonController,
};
