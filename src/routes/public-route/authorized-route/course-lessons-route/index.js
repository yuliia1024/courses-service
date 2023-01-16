const router = require('express').Router();
const { ROUTE } = require('../../../route-path');
const {
  validateValues,
} = require('../../../../validation');
const {
  REQUEST_DATA_SOURCE,
  USER_ROLE,
} = require('../../../../constants');
const routerHandler = require('../../../handler-wrapper');
const {
  createLessonController,
  updateLessonController,
  getLessonByIdController,
  getAllLessonByCourseController,
  deleteLessonController,
} = require('../../../../controllers/courses-lesson.controller');
const { checkRole } = require('../../../../services/role.service');
const { createLessonSchema } = require('./validation-schemes/create-lesson.schema');

router.post(
  `/${ROUTE.lesson.course}/:courseId`,
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  validateValues(createLessonSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(createLessonController),
);

router.get(
  `${ROUTE.lesson.course}/:courseId`,
  routerHandler(getAllLessonByCourseController),
);

router.put(
  `/:id/${ROUTE.lesson.course}/:courseId`,
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  validateValues(createLessonSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(updateLessonController),
);

router.get(
  `/:id/${ROUTE.lesson.course}/:courseId`,
  routerHandler(getLessonByIdController),
);

router.delete(
  `/:id/${ROUTE.lesson.course}/:courseId`,
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  routerHandler(deleteLessonController),
);

module.exports = router;
