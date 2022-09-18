const router = require('express').Router();
const routerHandler = require('../../../handler-wrapper');
const { ROUTE } = require('../../../route-path');
const { validateValues } = require('../../../../validation');
const { refreshTokenSchema } = require('./validation-schemes/refresh-token.schema');
const { REQUEST_DATA_SOURCE } = require('../../../../constants');
const {
  refreshTokenController,
  declineTokenController,
} = require('../../../../controllers/token.controller');

router.post(
  `/${ROUTE.token.refresh}`,
  validateValues(refreshTokenSchema, REQUEST_DATA_SOURCE.body),
  routerHandler(refreshTokenController),
);
router.get(
  `/${ROUTE.token.decline}`,
  routerHandler(declineTokenController),
);

module.exports = router;
