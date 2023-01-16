const router = require('express').Router();
const adminUserRouter = require('./admin-route');
const instructorUserRouter = require('./instructor-route');
const studentUserRouter = require('./student-route');
const tokenRouter = require('./token-route');
const lessonRouter = require('./course-lessons-route');
const { ROUTE } = require('../../route-path');

router.use(
  `/${ROUTE.admin.root}`,
  adminUserRouter,
);

router.use(
  `/${ROUTE.instructor.root}`,
  instructorUserRouter,
);

router.use(
  `/${ROUTE.student.root}`,
  studentUserRouter,
);

router.use(
  `/${ROUTE.course.root}`,
  studentUserRouter,
);

router.use(
  `/${ROUTE.lesson.root}`,
  lessonRouter,
);

router.use(
  `/${ROUTE.token.root}`,
  tokenRouter,
);

module.exports = router;
