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
  createCourseController,
  updateCourseController,
  getCourseByIdController,
  getCoursesByOptionsController,
  deleteCourseController,
  removeInstructorFromCourseController,
  assignInstructorsForCourseController,
  assignStudentForCourseController,
  removeStudentFromCourseController,
} = require('../../../../controllers/courses.controller');
const { checkRole } = require('../../../../services/role.service');
const { updateCourseInfoSchema } = require('./validation-schemes/update-course.schema');
const { createCourseSchema } = require('./validation-schemes/create-course.schema');
const { coursesFilteredSchema } = require('./validation-schemes/courses-filtered.schema');

router.post(
  '/',
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  validateValues(createCourseSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(createCourseController),
);

router.post(
  `/${ROUTE.course.filtered}`,
  validateValues(coursesFilteredSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(getCoursesByOptionsController),
);

router.post(
  `/:courseId/${ROUTE.course.instructor}/:instructorId`,
  checkRole([
    USER_ROLE.admin,
  ]),
  routerHandler(assignInstructorsForCourseController),
);

router.delete(
  `/:courseId/${ROUTE.course.instructor}/:instructorId`,
  checkRole([
    USER_ROLE.admin,
  ]),
  routerHandler(removeInstructorFromCourseController),
);

router.post(
  `/:courseId/${ROUTE.course.student}/:studentId`,
  checkRole([
    USER_ROLE.admin,
  ]),
  routerHandler(assignStudentForCourseController),
);

router.delete(
  `/:courseId/${ROUTE.course.student}/:studentId`,
  checkRole([
    USER_ROLE.admin,
  ]),
  routerHandler(removeStudentFromCourseController),
);

router.put(
  '/:id',
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  validateValues(updateCourseInfoSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(updateCourseController),
);

router.get(
  '/:id',
  routerHandler(getCourseByIdController),
);

router.delete(
  '/:id',
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  routerHandler(deleteCourseController),
);

module.exports = router;
