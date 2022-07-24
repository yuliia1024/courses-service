const externalRouter = require('./external-route');
const { ROUTE } = require('./route-path');

module.exports = router => {
  router.use(
    `/${ROUTE.public}`,
    externalRouter,
  );
};
