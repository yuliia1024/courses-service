const { SuccessResponse } = require('../custom-response');
const { getAdminUserById } = require('../services/db.service');
const {
  createAdminUser,
  updateAdminUser,
  inactiveAdminUser,
  getAllAdminsUser,
} = require('../services/admin-user.service');

const createAdminController = async (req, res) => {
  await createAdminUser(req);

  new SuccessResponse(res).send();
};

const updateAdminController = async (req, res) => {
  await updateAdminUser(req.params.id, req.userId, req.body);

  new SuccessResponse(res).send();
};

const getAdminByIdController = async (req, res) => {
  const adminUser = await getAdminUserById(req.params.userId);

  new SuccessResponse(res).send(adminUser);
};

const deleteAdminController = async (req, res) => {
  await inactiveAdminUser(req.params.userId);

  new SuccessResponse(res).send();
};

const getAllAdminsController = async (req, res) => {
  await getAllAdminsUser(req.body);

  new SuccessResponse(res).send();
};

module.exports = {
  createAdminController,
  updateAdminController,
  getAllAdminsController,
  getAdminByIdController,
  deleteAdminController,
};
