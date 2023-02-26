const router = require('express').Router();
const { ROUTE } = require('../../../route-path');
const {
  validateValues,
  checkMimeType,
} = require('../../../../validation');
const {
  REQUEST_DATA_SOURCE,
  USER_ROLE,
  DOC_MIME_TYPES,
} = require('../../../../constants');
const routerHandler = require('../../../handler-wrapper');
const { parseSingleFile } = require('../../../../services/multer.service');
const {
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
} = require('../../../../controllers/homework.controller');
const { checkRole } = require('../../../../services/role.service');
const { homeworkCreateSchema } = require('./validation-schemes/create-homework.schema');
const { homeworkMarkSchema } = require('./validation-schemes/mark-homework.schema');
const { homeworkOptionsSchema } = require('./validation-schemes/options-homework.schema');

router.post(
  '/',
  parseSingleFile,
  checkMimeType(DOC_MIME_TYPES),
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.student,
  ]),
  validateValues(homeworkCreateSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(createHomeworkController),
);

router.post(
  `/${ROUTE.homework.options}`,
  checkRole([
    USER_ROLE.admin,
  ]),
  validateValues(homeworkOptionsSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(getHomeworkByOptionsController),
);

router.get(
  `/${ROUTE.homework.course}/:id/${ROUTE.homework.student}`,
  checkRole([
    USER_ROLE.student,
  ]),
  routerHandler(getHomeworkByCourseIdForStudentController),
);

router.get(
  `/${ROUTE.homework.course}/:id/${ROUTE.homework.instructor}`,
  checkRole([
    USER_ROLE.instructor,
  ]),
  routerHandler(getHomeworkByCourseIdForInstructorsController),
);

router.get(
  `/${ROUTE.homework.lesson}/:id/${ROUTE.homework.student}`,
  checkRole([
    USER_ROLE.student,
  ]),
  routerHandler(getHomeworksByLessonIdForStudentController),
);

router.get(
  `/:id/${ROUTE.homework.student}`,
  checkRole([
    USER_ROLE.student,
  ]),
  routerHandler(getHomeworkByIdForStudentController),
);

router.post(
  `/:id/${ROUTE.homework.mark}`,
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  validateValues(homeworkMarkSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(markHomeworkController),
);

router.delete(
  `/:id/${ROUTE.homework.student}/:studentId`,
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.student,
  ]),
  routerHandler(deleteHomeworkController),
);

router.put(
  '/:id',
  parseSingleFile,
  checkMimeType(DOC_MIME_TYPES),
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.student,
  ]),
  routerHandler(updateHomeworkController),
);

router.get(
  '/:id',
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  routerHandler(getHomeworkByIdController),
);

module.exports = router;
