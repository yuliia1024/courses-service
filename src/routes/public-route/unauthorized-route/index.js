const router = require('express').Router();
const routerHandler = require('../../handler-wrapper');
const {
  registrationUserController,
  loginUserController,
} = require('../../../controllers/auth.controller');
const { ROUTE } = require('../../route-path');
const { validateValues } = require('../../../validation');
const { REQUEST_DATA_SOURCE } = require('../../../constants');
const { loginUserSchema } = require('./validation-schemes/login-user.schema');
const { registrationUserSchema } = require('./validation-schemes/registration-user.schema');

router.post(
  `/${ROUTE.registration}`,
  validateValues(registrationUserSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(registrationUserController),
);

router.post(
  `/${ROUTE.login}`,
  validateValues(loginUserSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(loginUserController),
);

module.exports = router;
