const router = require('express').Router();
const routerHandler = require('../../handler-wrapper');
const {
  registrationUserController,
} = require('../../../controllers/user.controller');

router.post(
  '/',
  routerHandler(registrationUserController),
);

module.exports = router;
