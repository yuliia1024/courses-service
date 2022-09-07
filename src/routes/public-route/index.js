const router = require('express').Router();
const authorizedRoute = require('./authorized-route');
const unauthorizedRoute = require('./unauthorized-route');
const { HEADER_PARAMS } = require('../../constants');
const { validateHeaderFields, verifyToken } = require('../../validation');

// the order of routes is important
router.use(
  '/',
  unauthorizedRoute,
);

router.use(
  '/',
  validateHeaderFields([
    HEADER_PARAMS.authorization,
  ]),
  verifyToken(),
  authorizedRoute
);

module.exports = router;
