const ROUTE = {
  public: 'public',
  login: 'login',
  registration: 'registration',
  admin: {
    root: 'admin',
    filtered: 'filtered',
  },
  student: 'student',
  instructor: 'instructor',
  token: {
    root: 'token',
    refresh: 'refresh',
    decline: 'decline',
  },
};

module.exports = {
  ROUTE,
};
