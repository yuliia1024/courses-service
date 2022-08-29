require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const { server } = require('../config');
const { errorHandler } = require('./error-handler');
const { swaggerDocument } = require('./utils/swagger');
const routes = require('./routes');
const { HTTP_STATUS } = require('./constants');
const { redisClient } = require('./services/redis.service');
const { createTables } = require('./db');

const { port, prefix } = server;
const globalPrefix = `/api/${prefix}`;
const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(globalPrefix, router);

if (server.env !== 'production') {
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument),
  );
}

routes(router);

app.use((req, res) => {
  res.status(HTTP_STATUS.notFound.code).send(`The '${req.path}' endpoint is not found`);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  errorHandler(req, res, err);
});

const startServer = () => {
  app.listen(port, async () => {
    console.log(`The server is listening on the port ${port}`);

    redisClient.on('ready', () => {
      console.info('Successful connection with the Redis server');
    });
    redisClient.on('error', err => {
      console.error(err.message);
      process.exit(1);
    });

    await createTables();
  });
};

module.exports = {
  startServer,
};
