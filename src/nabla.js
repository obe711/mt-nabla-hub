const dgram = require('node:dgram');
const logger = require('./config/logger');
const config = require('./config/config');
const { siteService, nablaService } = require('./services');
const asyncForEach = require('./utils/asyncForEach');
const { emit } = require('./io');

function createServer() {
  const server = dgram.createSocket('udp4');

  server.on('connect', () => {
    logger.info('conneced');
  });

  server.on('listening', () => {
    const address = server.address();
    logger.info(`server listening ${address.address}:${address.port}`);
  });

  return server;
}

function startNablaServer(messageHandler) {
  logger.info('starting server');
  const server = createServer();
  server.bind(config.nablaPort);

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      logger.error('Address in use, retrying...');
      setTimeout(() => {
        startNablaServer();
      }, 5000);
    }
  });

  server.on('message', messageHandler);

  return Promise.resolve(server);
}

function startSiteCheck() {
  setTimeout(async () => {
    const sites = await siteService.getAllSites();
    if (!sites) return;

    await asyncForEach(sites, async (site) => {
      try {
        const { data, durationInMs } = await nablaService.getSiteStats(site.siteName);
        Object.assign(data, { id: site.siteName, status: '2', duration: durationInMs });
        return emit(data.id, data);
      } catch {
        logger.error(`SITE OFF LINE - ${site.siteName}`);
        Object.assign(site, { status: '1' });
        return emit(site.siteName, site);
      }
    });

    startSiteCheck();
  }, 5000);
}

module.exports = {
  startNablaServer,
  startSiteCheck,
};
