const router = require('express').Router();
const routerHandler = require('../../handler-wrapper');
const { ROUTE } = require('../../route-path');
const { validateValues, validateHeaderFields } = require('../../../validation');
const { refreshTokenSchema } = require('./validation-schemes/refresh-token.schema');
const { REQUEST_DATA_SOURCE, HEADER_PARAMS } = require('../../../constants');
const {
  refreshTokenController,
  declineTokenController,
} = require('../../../controllers/token.controller');

router.post(
  `/${ROUTE.token.refresh}`,
  validateHeaderFields([
    HEADER_PARAMS.authorization,
  ]),
  validateValues(refreshTokenSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(refreshTokenController),
);
router.get(
  `/${ROUTE.token.decline}`,
  validateHeaderFields([
    HEADER_PARAMS.authorization,
  ]),
  routerHandler(declineTokenController),
);

module.exports = router;
