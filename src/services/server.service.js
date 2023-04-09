const httpStatus = require('http-status');
const { Server } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a server
 * @param {Object} serverBody
 * @returns {Promise<Server>}
 */
const createServer = async (serverBody) => {
  if (await Server.isIpTaken(serverBody.ip)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'ip already taken');
  }
  return Server.create(serverBody);
};

/**
 * Query for servers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} search - Text string to search in search fields
 * @returns {Promise<QueryResult>}
 */
const queryServers = async (filter, options, search) => {
  const servers = await Server.paginate(filter, options, search);
  return servers;
};

/**
 * Get server by id
 * @param {ObjectId} id
 * @returns {Promise<Server>}
 */
const getServerById = async (id) => {
  return Server.findById(id);
};

/**
 * Get server by ip
 * @param {string} ip
 * @returns {Promise<Server>}
 */
const getServerByIp = async (ip) => {
  return Server.findOne({ ip });
};

/**
 * Update server by id
 * @param {ObjectId} serverId
 * @param {Object} updateBody
 * @returns {Promise<Server>}
 */
const updateServerById = async (serverId, updateBody) => {
  const server = await getServerById(serverId);
  if (!server) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Server not found');
  }
  if (updateBody.ip && (await Server.isIpTaken(updateBody.ip, serverId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'ip already taken');
  }
  Object.assign(server, updateBody);
  await server.save();
  return server;
};

/**
 * Delete server by id
 * @param {ObjectId} serverId
 * @returns {Promise<Server>}
 */
const deleteServerById = async (serverId) => {
  const server = await getServerById(serverId);
  if (!server) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Server not found');
  }
  await server.remove();
  return server;
};

module.exports = {
  createServer,
  queryServers,
  getServerById,
  getServerByIp,
  updateServerById,
  deleteServerById,
};
