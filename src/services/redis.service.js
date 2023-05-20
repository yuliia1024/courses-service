const Redis = require('ioredis');
const { redisConfig } = require('../../config');

let redisClient;
const redisOptions = {
  host: redisConfig.host,
  port: redisConfig.port,
  username: redisConfig.username,
  password: redisConfig.password,
  keyPrefix: redisConfig.prefix,
};

if (process.env.NODE_ENV === 'test') {
  redisClient = {
    get: () => {},
    set: () => {},
    setex: () => {},
    del: () => {},
  };
} else if (redisConfig.isClusterMode) {
  redisClient = new Redis.Cluster([redisOptions]);
} else {
  redisClient = new Redis(redisOptions);
}

module.exports = {
  redisClient,
};
