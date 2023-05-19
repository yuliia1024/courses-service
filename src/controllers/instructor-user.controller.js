const { SuccessResponse } = require('../custom-response');
const { getActiveInstructorUserById, getInstructorUserByOptions } = require('../services/db.service');
const {
  createInstructorUser,
  updateInstructorUser,
  inactiveInstructorUser,
  getAllInstructorsUser,
} = require('../services/instructor-user.service');
const { checkPossibilityToUpdateOrDelete } = require('../utils');

// TODO: test
const createInstructorController = async (req, res) => {
  await createInstructorUser(req);

  new SuccessResponse(res).send();
};

const updateInstructorController = async (req, res) => {
  checkPossibilityToUpdateOrDelete(req.userRole, req.params.id, req.userId);

  await updateInstructorUser(req.params.id, req.userId, req.body);

  new SuccessResponse(res).send();
};

const getActiveInstructorByIdController = async (req, res) => {
  const instructorUser = await getActiveInstructorUserById(req.params.id);

  new SuccessResponse(res).send(instructorUser);
};

const getInstructorByOptionsController = async (req, res) => {
  const studentUser = await getInstructorUserByOptions({
    id: req.params.id,
  });

  new SuccessResponse(res).send(studentUser);
};

const deleteInstructorController = async (req, res) => {
  checkPossibilityToUpdateOrDelete(req.userRole, req.params.id, req.userId);

  await inactiveInstructorUser(req, req.params.id);

  new SuccessResponse(res).send();
};

const getAllInstructorsController = async (req, res) => {
  const result = await getAllInstructorsUser(req.body);

  new SuccessResponse(res).send(result);
};

module.exports = {
  createInstructorController,
  updateInstructorController,
  getAllInstructorsController,
  getActiveInstructorByIdController,
  deleteInstructorController,
  getInstructorByOptionsController,
};
