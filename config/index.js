require('dotenv').config();

const { parseBoolean } = require('../src/utils');

module.exports = {
  server: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    prefix: process.env.PREFIX_PATH || 'courses',
  },
  mailerConfig: {
    email: process.env.PROJECT_SENDER_EMAIL,
    password: process.env.PROJECT_MAIL_PASSWORD,
  },
  hash: {
    passwordHashRounds: Number(process.env.PASSWORD_HASH_ROUNDS),
  },
  AWS_S3: {
    region: process.env.REGION,
    bucketName: process.env.BUCKET_NAME,
  },
  passwordGeneratorOptions: {
    length: 10,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
  },
  tokenConfig: {
    secretKey: process.env.SECRET_KEY_TOKEN,
    expireAccessToken: Number(process.env.EXPIRE_ACCESS_TOKEN) * 60, // in seconds
    expireRefreshToken: process.env.EXPIRE_REFRESH_TOKEN, // string
  },
  requestLimitOptions: {
    time: Number(process.env.REQUEST_LIMIT_TIME) * 60 * 1000,
    maxRequests: Number(process.env.REQUEST_MAX_AMOUNT),
    ipWhiteList: process.env.IP_WHITE_LIST
      ? process.env.IP_WHITE_LIST.split(',')
      : null,
  },
  circuitBreakerOptions: { // https://www.npmjs.com/package/opossum
    // if a function takes longer than this time, trigger failure and open circuit breaker
    timeout: Number(process.env.HTTP_TIMEOUT) * 1000,
    // reject requests during this time
    resetTimeout: Number(process.env.RESET_TIMEOUT) * 1000,
    // when rich this percentage of failed requests than trigger failure and open circuit breaker
    errorThresholdPercentage: Number(process.env.ERROR_THRESHOLD_PERCENTAGE),
  },
  redisConfig: {
    prefix: process.env.REDIS_PREFIX, // prefix that will be added to keys name
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    isClusterMode: parseBoolean(process.env.REDIS_CLUSTER_MODE),
  },
  db: {
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimitMax: process.env.DB_MAX_CONNECTION,
    dialect: 'mysql',
    charset: 'utf8mb4',
  },
};
