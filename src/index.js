const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/logger');
const { server, emit } = require('./io');
const { startNablaServer } = require('./nabla');

const { serverService, siteService } = require('./services');

let nablaServer;

const messageHandler = async (msg, rinfo) => {
  const msgString = msg.toString();
  const msgObject = JSON.parse(msgString);
  logger.info(`${msgString}`);

  // PM2 Logs
  if (msgObject.nabla.nablaId === 'pm2') {

    console.log(msgObject.message.split(" - "));
    const logMessageArray = msgObject.message.split(" - ");
    const upSertedSite = await siteService.upsertSite({ siteName: msgObject.nabla.origin, status: "2" });

    if (msgObject.type === "out") {
      const apiLogMessage = { id: `api-${upSertedSite._id.toString()}`, siteName: upSertedSite.siteName, message: logMessageArray[1], req: logMessageArray[2] };
      return emit(apiLogMessage.id, apiLogMessage);
    }

    if (msgObject.type === "error") {
      const apiLogMessage = { id: upSertedSite._id.toString(), siteName: upSertedSite.siteName, message: logMessageArray[1], req: logMessageArray[2] };
      return emit("api-error", apiLogMessage);
    }

    return;
  }

  // Access or System
  const { provider, hostname } = msgObject;

  const upSertedServer = await serverService.upsertServer({ ip: rinfo.address, provider, hostname });

  Object.assign(msgObject.nabla, { ip: rinfo.address, port: rinfo.port, id: upSertedServer._id.toString() });
  if (msgObject.nabla.nablaId === 'system') {
    return emit(msgObject.nabla.id, msgObject);
  }

  if (msgObject.nabla.nablaId === 'access') {
    return emit(msgObject.nabla.nablaId, msgObject);
  }
};

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
      if (nablaServer) nablaServer.close();
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
    if (nablaServer) nablaServer.close();
  }
});
