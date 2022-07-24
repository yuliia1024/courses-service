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

const TOKEN_AUTH_REGEXP = /^(?:Bearer)\s([\w-]+?\.[\w-]+?\.[\w-]+?)$/;

const DEFAULT_ERROR_MESSAGE = 'An error has occurred';

const LANGUAGES = {
  en: 'en', // English
};

const NAME_SPACES = {
  errorNS: 'errorNS',
};

module.exports = {
  REQUEST_DATA_SOURCE,
  HTTP_STATUS,
  HEADER_PARAMS,
  TOKEN_TYPES,
  TOKEN_AUTH_REGEXP,
  DB_REFERENTIAL_ACTIONS,
  PATH_DB_SCHEMES,
  DEFAULT_ERROR_MESSAGE,
  LANGUAGES,
  NAME_SPACES,
};
