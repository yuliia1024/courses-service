const router = require('express').Router();
const routerHandler = require('../../handler-wrapper');
const {
  testController,
} = require('../../../controllers/auth.controller');

router.post(
  '/',
  routerHandler(testController),
);

module.exports = router;
