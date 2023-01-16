const { SuccessResponse } = require('../custom-response');
const {
  getActiveStudentUserById,
  getStudentUserByOptions,
  getStudentIdsByOption,
} = require('../services/db.service');
const {
  createStudentUser,
  updateStudentUser,
  inactiveStudentUser,
  getAllStudentsUser,
} = require('../services/student-user.service');
const { checkPossibilityToUpdateOrDelete } = require('../utils');
const { DB_CONTRACT } = require('../db/db.contract');

const createStudentController = async (req, res) => {
  await createStudentUser(req);

  new SuccessResponse(res).send();
};

const updateStudentController = async (req, res) => {
  checkPossibilityToUpdateOrDelete(req.userRole, req.params.id, req.userId);

  await updateStudentUser(req.params.id, req.userId, req.body);

  new SuccessResponse(res).send();
};

const getActiveStudentByIdController = async (req, res) => {
  const studentUser = await getActiveStudentUserById(req.params.id);

  new SuccessResponse(res).send(studentUser);
};

const getStudentByOptionsController = async (req, res) => {
  const studentUser = await getStudentUserByOptions({
    id: req.params.id,
  });

  new SuccessResponse(res).send(studentUser);
};

const deleteStudentController = async (req, res) => {
  checkPossibilityToUpdateOrDelete(req.userRole, req.params.id, req.userId);

  await inactiveStudentUser(req, req.params.id);

  new SuccessResponse(res).send();
};

const getAllStudentsController = async (req, res) => {
  let studentIds;

  if (req.body.courseId) {
    studentIds = await getStudentIdsByOption({
      courseId: req.body.courseId,
      ...(req.body.isActiveStudent && { [DB_CONTRACT.studentUser.isActive.property]: req.body.isActiveStudent }),
    });
  }

  const result = await getAllStudentsUser(req.body, studentIds);

  new SuccessResponse(res).send(result);
};

module.exports = {
  createStudentController,
  updateStudentController,
  getAllStudentsController,
  getActiveStudentByIdController,
  getStudentByOptionsController,
  deleteStudentController,
};
