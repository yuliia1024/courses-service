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
  createInstructorController,
  updateInstructorController,
  getAllInstructorsController,
  getActiveInstructorByIdController,
  deleteInstructorController,
  getInstructorByOptionsController,
} = require('../../../../controllers/instructor-user.controller');
const { checkRole } = require('../../../../services/role.service');
const { instructorSchema } = require('./validation-schemes/instructor.schema');
const { instructorFilteredSchema } = require('./validation-schemes/instructor-filtered.schema');
const { updateInstructorSchema } = require('./validation-schemes/update-instructor.schema');

router.post(
  '/',
  checkRole([
    USER_ROLE.admin,
  ]),
  validateValues(instructorSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(createInstructorController),
);

router.post(
  `/${ROUTE.instructor.filtered}`,
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  validateValues(instructorFilteredSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(getAllInstructorsController),
);

router.get(
  `/${ROUTE.instructor.active}/:id`,
  routerHandler(getActiveInstructorByIdController),
);

router.put(
  '/:id',
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  validateValues(updateInstructorSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(updateInstructorController),
);

router.get(
  '/:id',
  checkRole([
    USER_ROLE.admin,
  ]),
  routerHandler(getInstructorByOptionsController),
);

router.delete(
  '/:id',
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  routerHandler(deleteInstructorController),
);

module.exports = router;
