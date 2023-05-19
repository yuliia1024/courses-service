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
  createStudentController,
  updateStudentController,
  getAllStudentsController,
  deleteStudentController,
  getActiveStudentByIdController,
  getStudentByOptionsController,
  addStudentFeedbackController,
  getStudentFeedbacksForStudentController,
  getStudentFeedbacksByOptionsController,
} = require('../../../../controllers/student-user.controller');
const { checkRole } = require('../../../../services/role.service');
const { studentSchema } = require('./validation-schemes/student.schema');
const { studentFilteredSchema } = require('./validation-schemes/student-filtered.schema');
const { updateStudentSchema } = require('./validation-schemes/update-student.schema');
const { studentFeedbackSchema } = require('./validation-schemes/feedback.schema');
const { getStudentFeedbackSchema } = require('./validation-schemes/get-feedback.schema');

router.post(
  '/',
  checkRole([
    USER_ROLE.admin,
  ]),
  validateValues(studentSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(createStudentController),
);

router.post(
  `/${ROUTE.student.filtered}`,
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  validateValues(studentFilteredSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(getAllStudentsController),
);

router.get(
  `/${ROUTE.student.active}/:id`,
  routerHandler(getActiveStudentByIdController),
);

router.get(
  `/${ROUTE.student.feedback}`,
  checkRole([
    USER_ROLE.student,
  ]),
  routerHandler(getStudentFeedbacksForStudentController),
);

router.post(
  `/${ROUTE.student.feedback}`,
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  validateValues(studentFeedbackSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(addStudentFeedbackController),
);

router.post(
  `/${ROUTE.student.feedback}/${ROUTE.student.options}`,
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.instructor,
  ]),
  validateValues(getStudentFeedbackSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(getStudentFeedbacksByOptionsController),
);

router.put(
  '/:id',
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.student,
  ]),
  validateValues(updateStudentSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(updateStudentController),
);

router.get(
  '/:id',
  checkRole([
    USER_ROLE.admin,
  ]),
  routerHandler(getStudentByOptionsController),
);

router.delete(
  '/:id',
  checkRole([
    USER_ROLE.admin,
    USER_ROLE.student,
  ]),
  routerHandler(deleteStudentController),
);

module.exports = router;
