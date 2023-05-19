const {
  omit,
  get,
} = require('lodash');
const { Op } = require('sequelize');
const { SuccessResponse } = require('../custom-response');
const {
  createHomework,
  removeHomework,
  markHomework,
  updateHomework,
} = require('../services/homework.service');
const {
  ForbiddenError,
  NotFoundError,
} = require('../error-handler');
const {
  USER_ROLE,
  UPLOADING_FILE,
  HTTP_STATUS,
  HEADER_PARAMS,
} = require('../constants');
const {
  getHomeworksByOptions,
  getOneHomeworkByOptions,
  getHomeworksByOptionsWithLessonInfo,
  getLessonById,
} = require('../services/db.service');
const { DB_CONTRACT } = require('../db/db.contract');
const {
  checkDataFromDB,
  createCustomError,
} = require('../utils');
const { checkUserPermissionToAccessCourseInfo } = require('../services/courses.service');
const { getFileS3 } = require('../services/s3.service');

// TODO: test
const createHomeworkController = async (req, res) => {
  if (req.userRole !== USER_ROLE.admin && req.body.studentId !== req.userId) {
    throw new ForbiddenError('You can create homework only for yourself.');
  }
  await createHomework(req.body, req[UPLOADING_FILE.fieldName], req.userId);

  new SuccessResponse(res).send();
};

const deleteHomeworkController = async (req, res) => {
  if (req.userRole !== USER_ROLE.admin && req.body.studentId !== req.userId) {
    throw new ForbiddenError('You can delete only your homework.');
  }

  await removeHomework(req.params.id, req.params.studentId);

  new SuccessResponse(res).send();
};

// TODO: test
const markHomeworkController = async (req, res) => {
  await markHomework(req.params.id, req.body, req.userId, req.userRole);

  new SuccessResponse(res).send();
};

const updateHomeworkController = async (req, res) => {
  await updateHomework(req);

  new SuccessResponse(res).send();
};

// for students file
const getHomeworkByIdForStudentController = async (req, res) => {
  const homework = await getOneHomeworkByOptions({
    studentId: req.userId,
    id: req.params.id,
  });

  checkDataFromDB(homework);

  let fileStream;

  try {
    fileStream = await getFileS3(homework.filePath);
  } catch (err) {
    if (get(err, '$metadata.httpStatusCode') === HTTP_STATUS.notFound.code) {
      throw new NotFoundError('The file is not found');
    }

    throw createCustomError(err);
  }

  res.set('Content-Length', fileStream.headers[HEADER_PARAMS.contentLength]);

  fileStream.pipe(res);
};

// for instructors/admins file
const getHomeworkByIdController = async (req, res) => {
  const homework = await getOneHomeworkByOptions({
    id: req.params.id,
  });

  checkDataFromDB(homework);

  const lesson = await getLessonById(homework.courseLessonId);

  await checkUserPermissionToAccessCourseInfo(req.userRole, req.userId, lesson.courseId);

  let fileStream;

  try {
    fileStream = await getFileS3(homework.filePath);
  } catch (err) {
    if (get(err, '$metadata.httpStatusCode') === HTTP_STATUS.notFound.code) {
      throw new NotFoundError('The file is not found');
    }

    throw createCustomError(err);
  }

  res.set('Content-Length', fileStream.headers[HEADER_PARAMS.contentLength]);

  fileStream.pipe(res);
};

// for admins
const getHomeworkByOptionsController = async (req, res) => {
  const result = await getHomeworksByOptions({
    ...req.body,
    ...(req.body.mark !== undefined && {
      mark: req.body.mark
        ? {
          [Op.not]: null,
        }
        : {
          [Op.is]: null,
        },
    }),
  });

  new SuccessResponse(res).send(result);
};

// for students
const getHomeworksByLessonIdForStudentController = async (req, res) => {
  const result = await getHomeworksByOptions({
    studentId: req.userId,
    courseLessonId: req.params.id,
  });

  new SuccessResponse(res).send(result);
};

// for students
const getHomeworkByCourseIdForStudentController = async (req, res) => {
  const result = await getHomeworksByOptionsWithLessonInfo({
    studentId: req.userId,
    [`$${DB_CONTRACT.homework.courseLessonReferenceName}.${DB_CONTRACT.coursesLesson.courseId.column}$`]: req.params.id,
  });

  new SuccessResponse(res).send(
    result.map(item => omit(item, [DB_CONTRACT.homework.courseLessonReferenceName]))
  );
};

// for instructors
const getHomeworkByCourseIdForInstructorsController = async (req, res) => {
  await checkUserPermissionToAccessCourseInfo(req.userRole, req.userId, req.params.id);

  const result = await getHomeworksByOptionsWithLessonInfo({
    [`$${DB_CONTRACT.homework.courseLessonReferenceName}.${DB_CONTRACT.coursesLesson.courseId.column}$`]: req.params.id,
  });

  new SuccessResponse(res).send(
    result.map(item => omit(item, [DB_CONTRACT.homework.courseLessonReferenceName]))
  );
};

module.exports = {
  createHomeworkController,
  deleteHomeworkController,
  markHomeworkController,
  updateHomeworkController,
  getHomeworkByIdController,
  getHomeworkByOptionsController,
  getHomeworkByCourseIdForStudentController,
  getHomeworksByLessonIdForStudentController,
  getHomeworkByIdForStudentController,
  getHomeworkByCourseIdForInstructorsController,
};
