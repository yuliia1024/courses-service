const router = require('express').Router();
// const userRouter = require('./user-route');
const tokenRouter = require('./token-route');
const { ROUTE } = require('../../route-path');

// router.use(
//   `/${ROUTE.user.root}`,
//   userRouter,
// );

router.use(
  `/${ROUTE.token.root}`,
  tokenRouter,
);

module.exports = router;
