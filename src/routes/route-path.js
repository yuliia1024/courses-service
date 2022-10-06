const ROUTE = {
  public: 'public',
  login: 'login',
  registration: 'registration',
  admin: {
    root: 'admin',
    filtered: 'filtered',
  },
  student: {
    root: 'student',
    active: 'active',
    filtered: 'filtered',
  },
  instructor: {
    root: 'instructor',
    active: 'active',
    filtered: 'filtered',
  },
  token: {
    root: 'token',
    refresh: 'refresh',
    decline: 'decline',
  },
};

module.exports = {
  ROUTE,
};
