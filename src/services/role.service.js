const {
  UnauthorizedError,
  ForbiddenError,
} = require('../error-handler');

const checkRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.userRole) {
    next(
      new UnauthorizedError('The role is incorrect')
    );

    return;
  }

  if (!allowedRoles.includes(req.userRole)) {
    next(
      new ForbiddenError('You do not have permission for this action')
    );

    return;
  }
  next();
};

module.exports = {
  checkRole,
};
