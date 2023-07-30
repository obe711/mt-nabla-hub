const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/logger');
const { server, emit } = require('./io');
const { startNablaServer, startSiteCheck } = require('./nabla');
const { nablaErrorService, nablaLogService, accessLogService, apnService } = require("./services");
const { NablaSystem } = require('../nabla-hub');

const SYS_STAT_UPDATE_EVENT = 'data';
const { serverService, siteService } = require('./services');

let nablaServer;

const messageHandler = async (msg, rinfo) => {

  const msgString = msg.toString();
  const msgObject = JSON.parse(msgString);


  if (msgObject?.nablaId === "apiLog") {
    if (msgObject?.level === "error") return;
    await nablaLogService.createNablaLog(msgObject);
    const recentRecords = await nablaLogService.queryNablaLogs(msgObject?.level, { siteName: msgObject?.siteName }, { sortBy: "_id:desc" }, null);
    if (!msgObject?.siteName) return;
    //console.log("apiLog", msgObject.siteName)
    await siteService.upsertSite({ siteName: msgObject.siteName, status: '1' });
    return emit(`${msgObject?.siteName}-${msgObject?.level}`, recentRecords?.results);
  }



  if (msgObject?.nablaId === 'nablaError') {

    if (msgObject?.nablaError)
      await nablaErrorService.createNablaError(msgObject.nablaError);
    const recentRecords = await nablaErrorService.queryNablaErrors({ isFixed: false }, { sortBy: "_id:desc" }, null);
    // send error cnt badge to all admins
    apnService.sendErrorCountToAdmins(recentRecords.totalResults, msgObject.nablaError.message);
    return emit("nablaError", recentRecords?.results);
  }

  // PM2 Logs
  if (msgObject?.nabla?.nablaId === 'pm2') {
    console.log(msgObject.message);
    const logMessageArray = msgObject.message.split(' - ');
    const upSertedSite = await siteService.upsertSite({ siteName: msgObject.nabla.origin, status: '1' });

    if (msgObject.type === 'out') {
      const apiLogMessageId = `apiLog:${upSertedSite._id.toString()}`;
      const apiLogMessage = {
        id: apiLogMessageId,
        siteName: upSertedSite.siteName,
        message: logMessageArray[1],
        req: logMessageArray[2],
      };
      return emit(apiLogMessageId, apiLogMessage);
    }

    if (msgObject.type === 'error') {
      const apiLogMessage = {
        id: upSertedSite._id.toString(),
        siteName: upSertedSite.siteName,
        message: logMessageArray[1],
        req: logMessageArray[2],
      };
      return emit('api-error', apiLogMessage);
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
    if (msgObject.uri === '/nabla' || msgObject.method === "OPTIONS") return;

    // console.log(msgObject);
    await accessLogService.createAccessLog(msgObject);

    const recentRecords = await accessLogService.queryAccessLogs({}, { sortBy: "_id:desc" }, null);
    //console.log(recentRecords?.results?.length)
    return emit("access", recentRecords?.results);
  }
};

const systemUpdateMessageHandler = async (msg) => {
  Object.assign(msg, { provider: config.nablaProvider });
  const upSertedServer = await serverService.upsertServer({
    ip: config.nablaHubIp,
    provider: msg.provider,
    hostname: msg.hostname,
  });
  if (!upSertedServer) {
    console.error("No upSertedServer");
    return;
  }
  const socketId = upSertedServer._id.toString();
  return emit(socketId, msg);
};

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server.listen(config.port, async () => {
    logger.info(`Listening to port ${config.port}`);

    // Start NABLA service here
    nablaServer = await startNablaServer(messageHandler);

    // Start system monitor
    const nablaSystem = new NablaSystem({ logger });
    nablaSystem.on(SYS_STAT_UPDATE_EVENT, systemUpdateMessageHandler);

    startSiteCheck();
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
