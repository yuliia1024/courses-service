const { SuccessResponse } = require('../custom-response');
const {
  removeCourseInstructor,
  removeCourseStudent,
  getActiveStudentUserById,
  getActiveInstructorUserById,
  getCourseInstructorsByOptions,
  getCoursesByStudentIdAndOptions,
  getAllCoursesByInstructorsId,
} = require('../services/db.service');
const {
  createCourse,
  updateCourse,
  deleteCourseById,
  getAllCourseInfoById,
  getAllCourses,
  assignInstructorsForCourse,
  checkUserPermissionToAccessCourseInfo,
  assignStudentForCourse,
} = require('../services/courses.service');
const { USER_ROLE } = require('../constants');
const { ForbiddenError,
  BadRequestError } = require('../error-handler');
const { DB_CONTRACT } = require('../db/db.contract');

const createCourseController = async (req, res) => {
  await createCourse(req);

  new SuccessResponse(res).send();
};

const updateCourseController = async (req, res) => {
  await checkUserPermissionToAccessCourseInfo(req.userRole, req.userId, req.params.id);
  await updateCourse(req.params.id, req.userId, req.body);

  new SuccessResponse(res).send();
};

const getCourseByIdController = async (req, res) => {
  const course = await getAllCourseInfoById(req.params.id);

  new SuccessResponse(res).send(course);
};

const getCoursesByOptionsController = async (req, res) => {
  const courses = await getAllCourses(req.body);

  new SuccessResponse(res).send(courses);
};

// TODO: test
const getCoursesByInstructorIdController = async (req, res) => {
  const instructorId = req.userRole === USER_ROLE.admin ? req.params.id : req.userId;
  const courses = await getAllCoursesByInstructorsId(instructorId);

  new SuccessResponse(res).send(
    courses.map(course => course[DB_CONTRACT.coursesInstructor.coursesReferenceName])
  );
};

// TODO: test
const getCoursesByStudentIdController = async (req, res) => {
  const studentId = req.userRole === USER_ROLE.admin ? req.params.id : req.userId;
  const courses = await getCoursesByStudentIdAndOptions(studentId);

  new SuccessResponse(res).send(
    courses.map(course => course[DB_CONTRACT.coursesStudent.coursesReferenceName])
  );
};

const deleteCourseController = async (req, res) => {
  await checkUserPermissionToAccessCourseInfo(req.userRole, req.userId, req.params.id);
  await deleteCourseById(req.params.id);

  new SuccessResponse(res).send();
};

const removeInstructorFromCourseController = async (req, res) => {
  await checkUserPermissionToAccessCourseInfo(req.userRole, req.userId, req.params.courseId);
  await getAllCourseInfoById(req.params.courseId);
  const instructors = await getCourseInstructorsByOptions({ courseId: req.params.courseId });

  if (instructors.length <= 1) {
    throw new BadRequestError('You can`t remove the last instructor from course.');
  }
  await removeCourseInstructor(req.params.courseId, req.params.instructorId);

  new SuccessResponse(res).send();
};

// TODO: test
const assignInstructorsForCourseController = async (req, res) => {
  await getAllCourseInfoById(req.params.courseId);
  await getActiveInstructorUserById(req.params.instructorId);
  await assignInstructorsForCourse({
    courseId: req.params.courseId,
    instructorId: req.params.instructorId,
  }, req.userId);

  new SuccessResponse(res).send();
};

// TODO: test
const assignStudentForCourseController = async (req, res) => {
  await getAllCourseInfoById(req.params.courseId);

  if (req.userRole === USER_ROLE.student && req.params.studentId !== req.userId) {
    throw new ForbiddenError('You do not have permission for this actions');
  }
  if (req.userRole !== USER_ROLE.student) {
    await checkUserPermissionToAccessCourseInfo(req.userRole, req.userId, req.params.courseId);
  }

  await getActiveStudentUserById(req.params.studentId);
  await assignStudentForCourse({
    courseId: req.params.courseId,
    studentId: req.params.studentId,
  }, req.userId);

  new SuccessResponse(res).send();
};

const removeStudentFromCourseController = async (req, res) => {
  await getAllCourseInfoById(req.params.courseId);

  if (req.userRole === USER_ROLE.student && req.params.studentId !== req.userId) {
    throw new ForbiddenError('You do not have permission for this actions');
  }
  if (req.userRole !== USER_ROLE.student) {
    await checkUserPermissionToAccessCourseInfo(req.userRole, req.userId, req.params.courseId);
  }

  await removeCourseStudent(req.params.courseId, req.params.studentId);

  new SuccessResponse(res).send();
};

module.exports = {
  createCourseController,
  updateCourseController,
  getCourseByIdController,
  getCoursesByOptionsController,
  deleteCourseController,
  removeInstructorFromCourseController,
  assignInstructorsForCourseController,
  assignStudentForCourseController,
  removeStudentFromCourseController,
  getCoursesByInstructorIdController,
  getCoursesByStudentIdController,
};
