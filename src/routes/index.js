const publicRouter = require('./public-route');
const { ROUTE } = require('./route-path');

module.exports = router => {
  router.use(
    `/${ROUTE.public}`,
    publicRouter,
  );
};
