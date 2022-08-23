const router = require('express').Router();
const routerHandler = require('../../handler-wrapper');
const {
  testController,
} = require('../../../controllers/auth.controller');

router.get(
  '/',
  routerHandler(testController),
);

module.exports = router;
