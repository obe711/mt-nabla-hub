const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/logger');
const { server, emit } = require('./io');
const { startNablaServer } = require("./nabla");

let nablaServer;

const messageHandler = (msg, rinfo) => {
  const msgString = msg.toString();
  const msgObject = JSON.parse(msgString);
  Object.assign(msgObject.nabla, { ip: rinfo.address, port: rinfo.port });
  console.log(msgObject)
  // logger.info(`server got: ${msgString} from ${rinfo.address}:${rinfo.port}`);

  emit("data", msgObject);

}

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server.listen(config.port, async () => {
    logger.info(`Listening to port ${config.port}`);

    // Start NABLA service here
    nablaServer = await startNablaServer(messageHandler);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      nablaServer.close();
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
    nablaServer.close();
  }
});
