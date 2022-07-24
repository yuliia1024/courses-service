const router = require('express').Router();
const authRouter = require('./auth-route');
const { ROUTE } = require('../route-path');

router.use(
  `/${ROUTE.auth.root}`,
  authRouter,
);

module.exports = router;
