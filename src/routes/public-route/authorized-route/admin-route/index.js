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
  createAdminController,
  updateAdminController,
  getAllAdminsController,
  getAdminByIdController,
  deleteAdminController,
} = require('../../../../controllers/admin-user.controller');
const { checkRole } = require('../../../../services/role.service');
const { adminSchema } = require('./validation-schemes/admin.schema');
const { adminFilteredSchema } = require('./validation-schemes/admin-filtered.schema');
const { updateAdminSchema } = require('./validation-schemes/update-admin.schema');

router.post(
  '/',
  checkRole([
    USER_ROLE.admin,
  ]),
  validateValues(adminSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(createAdminController),
);

router.post(
  `/${ROUTE.admin.filtered}`,
  checkRole([
    USER_ROLE.admin,
  ]),
  validateValues(adminFilteredSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(getAllAdminsController),
);

router.put(
  '/:id',
  checkRole([
    USER_ROLE.admin,
  ]),
  validateValues(updateAdminSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(updateAdminController),
);

router.get(
  '/:id',
  checkRole([
    USER_ROLE.admin,
  ]),
  routerHandler(getAdminByIdController),
);

router.delete(
  '/:id',
  checkRole([
    USER_ROLE.admin,
  ]),
  routerHandler(deleteAdminController),
);

module.exports = router;
