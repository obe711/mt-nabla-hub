const httpStatus = require('http-status');
const { NablaError } = require('../models');
const ApiError = require('../utils/ApiError');


/**
 * Create a nabla error
 * @param {Object} body
 * @returns {Promise<NablaError>}
 */
const createNablaError = async (body) => {
  Object.assign(body, { isFixed: 0 })
  return NablaError.create(body);
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
const queryNablaErrors = async (filter, options, search) => {
  const servers = await NablaError.paginate(filter, options, search);
  return servers;
};

/**
 * Get server by id
 * @param {ObjectId} id
 * @returns {Promise<NablaError>}
 */
const getNablaErrorById = async (id) => {
  return NablaError.findById(id);
};



/**
 * Delete server by id
 * @param {ObjectId} serverId
 * @returns {Promise<NablaError>}
 */
const deleteNablaErrorById = async (serverId) => {
  const server = await getNablaErrorById(serverId);
  if (!server) {
    throw new ApiError(httpStatus.NOT_FOUND, 'NablaError not found');
  }
  await server.remove();
  return server;
};

module.exports = {
  createNablaError,
  queryNablaErrors,
  getNablaErrorById,
  deleteNablaErrorById,
};