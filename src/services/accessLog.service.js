const httpStatus = require('http-status');
const { AccessLog } = require('../models');
const ApiError = require('../utils/ApiError');


/**
 * Create a nabla error
 * @param {Object} body
 * @returns {Promise<AccessLog>}
 */
const createAccessLog = async (body) => {
  return AccessLog.create(body);
};

/**
 * Query for accessLogs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} search - Text string to search in search fields
 * @returns {Promise<QueryResult>}
 */
const queryAccessLogs = async (filter, options, search) => {
  const accessLogs = await AccessLog.paginate(filter, options, search);
  return accessLogs;
};

/**
 * Get accessLog by id
 * @param {ObjectId} id
 * @returns {Promise<AccessLog>}
 */
const getAccessLogById = async (id) => {
  return AccessLog.findById(id);
};



/**
 * Delete accessLog by id
 * @param {ObjectId} accessLogId
 * @returns {Promise<AccessLog>}
 */
const deleteAccessLogById = async (accessLogId) => {
  const accessLog = await getAccessLogById(accessLogId);
  if (!accessLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AccessLog not found');
  }
  await accessLog.remove();
  return accessLog;
};

module.exports = {
  createAccessLog,
  queryAccessLogs,
  getAccessLogById,
  deleteAccessLogById,
};