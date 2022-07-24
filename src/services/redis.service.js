const Redis = require('ioredis');
const { redisConfig } = require('../../config');

let redisClient;
const redisOptions = {
  host: redisConfig.host,
  port: redisConfig.port,
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
