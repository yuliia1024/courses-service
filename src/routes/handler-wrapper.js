const { breaker } = require('../utils/circuit-breaker');

module.exports = routerController => {
  const breakerController = breaker(routerController);

  return async (req, res, next) => {
    try {
      await breakerController.fire(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
