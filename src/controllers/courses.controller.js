const { SuccessResponse } = require('../custom-response');
const {
  removeCourseInstructor,
  removeCourseStudent,
  getActiveStudentUserById,
  getActiveInstructorUserById,
  getCourseInstructorsByOptions,
} = require('../services/db.service');
const {
  createCourse,
  updateCourse,
  deleteCourseById,
  getAllCourseInfoById,
  getAllCourses,
  assignInstructorsForCourse,
  checkUserPermissionToModifyCourseInfo,
  assignStudentForCourse,
} = require('../services/courses.service');
const { USER_ROLE } = require('../constants');
const { ForbiddenError,
  BadRequestError } = require('../error-handler');

const createCourseController = async (req, res) => {
  await createCourse(req);

  new SuccessResponse(res).send();
};

const updateCourseController = async (req, res) => {
  await checkUserPermissionToModifyCourseInfo(req.userRole, req.userId, req.params.id);
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

const deleteCourseController = async (req, res) => {
  await checkUserPermissionToModifyCourseInfo(req.userRole, req.userId, req.params.id);
  await deleteCourseById(req.params.id);

  new SuccessResponse(res).send();
};

const removeInstructorFromCourseController = async (req, res) => {
  await checkUserPermissionToModifyCourseInfo(req.userRole, req.userId, req.params.courseId);
  await getAllCourseInfoById(req.params.courseId);
  const instructors = await getCourseInstructorsByOptions({ courseId: req.params.courseId });

  if (instructors.length <= 1) {
    throw new BadRequestError('You can`t remove the last instructor from course.');
  }
  await removeCourseInstructor(req.params.courseId, req.params.instructorId);

  new SuccessResponse(res).send();
};

const assignInstructorsForCourseController = async (req, res) => {
  await getAllCourseInfoById(req.params.courseId);
  await getActiveInstructorUserById(req.params.instructorId);
  await assignInstructorsForCourse({
    courseId: req.params.courseId,
    instructorId: req.params.instructorId,
  }, req.userId);

  new SuccessResponse(res).send();
};

const assignStudentForCourseController = async (req, res) => {
  await getAllCourseInfoById(req.params.courseId);

  if (req.userRole === USER_ROLE.student && req.params.studentId !== req.userId) {
    throw new ForbiddenError('You do not have permission for this actions');
  }
  if (req.userRole !== USER_ROLE.student) {
    await checkUserPermissionToModifyCourseInfo(req.userRole, req.userId, req.params.courseId);
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
    await checkUserPermissionToModifyCourseInfo(req.userRole, req.userId, req.params.courseId);
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
};
