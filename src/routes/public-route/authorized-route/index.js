const router = require('express').Router();
const adminUserRouter = require('./admin-route');
const tokenRouter = require('./token-route');
const { ROUTE } = require('../../route-path');

router.use(
  `/${ROUTE.admin.root}`,
  adminUserRouter,
);

router.use(
  `/${ROUTE.token.root}`,
  tokenRouter,
);

module.exports = router;
