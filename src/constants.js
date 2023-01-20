const REQUEST_DATA_SOURCE = {
  body: 'body',
  query: 'query',
};
const HTTP_STATUS = {
  ok: {
    code: 200,
  },
  created: {
    code: 201,
  },
  badRequest: {
    code: 400,
    error: 'Bad Request',
  },
  unauthorized: {
    code: 401,
    error: 'Unauthorized',
  },
  forbidden: {
    code: 403,
    error: 'Forbidden',
  },
  notFound: {
    code: 404,
    error: 'Not Found',
  },
  internalServerError: {
    code: 500,
    error: 'Internal Server Error',
  },
};
const HEADER_PARAMS = {
  authorization: 'Authorization',
  contentType: 'content-type',
  contentLength: 'content-length',
};
const USER_ROLE = {
  admin: 'admin',
  instructor: 'instructor',
  student: 'student',
};
const STUDENT_COURSES_STATUS = {
  passed: 'passed',
  rejected: 'rejected',
  inProgress: 'inProgress',
};
const STUDENT_COURSES_MAX_COUNT = 5;
const COURSE_LESSONS_MIN_COUNT = 5;
const TOKEN_TYPES = {
  access: 'access',
  refresh: 'refresh',
};
const DB_REFERENTIAL_ACTIONS = {
  CASCADE: 'CASCADE',
  SET_NULL: 'SET NULL',
  RESTRICT: 'RESTRICT',
  NO_ACTION: 'NO ACTION',
  SET_DEFAULT: 'SET DEFAULT',
};
const PATH_DB_SCHEMES = './db/schemes';

const REGEX = {
  // eslint-disable-next-line
  email: /(?=^.{0,50}$)(^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/,
  // eslint-disable-next-line
  token: /^(?:Bearer)\s([\w-]+?\.[\w-]+?\.[\w-]+?)$/,
};
// eslint-disable-next-line
const EMAIL_PATTERN = /(?=^.{0,50}$)(^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;
/*
At least one upper case English letter, (?=.*?[A-Z])
At least one lower case English letter, (?=.*?[a-z])
At least one digit, (?=.*?[0-9])
Minimum eight in length .{8,256} (with the anchors)
 */
const PASSWORD_PATTERN = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,256}$/;

module.exports = {
  REQUEST_DATA_SOURCE,
  HTTP_STATUS,
  HEADER_PARAMS,
  TOKEN_TYPES,
  DB_REFERENTIAL_ACTIONS,
  PATH_DB_SCHEMES,
  REGEX,
  USER_ROLE,
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
  STUDENT_COURSES_STATUS,
  COURSE_LESSONS_MIN_COUNT,
  STUDENT_COURSES_MAX_COUNT,
};
