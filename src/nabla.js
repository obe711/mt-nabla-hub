const dgram = require('node:dgram');
const logger = require("./config/logger");
const config = require("./config/config");

function createServer() {
  const server = dgram.createSocket('udp4');

  server.on("connect", () => {
    logger.info("conneced");
  });

  server.on('listening', () => {
    const address = server.address();
    logger.info(`server listening ${address.address}:${address.port}`);
  });

  return server;
}

function startNablaServer(messageHandler) {
  logger.info("starting server");
  const server = createServer()
  server.bind(config.nablaPort);

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      logger.error('Address in use, retrying...');
      setTimeout(() => {
        startNablaServer();
      }, 1000);
    }
  });

  server.on('message', messageHandler);

  return Promise.resolve(server);
}

module.exports = {
  startNablaServer
}