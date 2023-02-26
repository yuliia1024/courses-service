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
    options: 'options',
    feedback: 'feedback',
  },
  course: {
    root: 'course',
    instructor: 'instructor',
    student: 'student',
    filtered: 'filtered',
    averageMark: 'average-mark',
  },
  lesson: {
    root: 'lesson',
    course: 'course',
    filtered: 'filtered',
  },
  homework: {
    instructor: 'instructor',
    lesson: 'lesson',
    student: 'student',
    course: 'course',
    root: 'homework',
    file: 'file',
    mark: 'mark',
    options: 'options',
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
