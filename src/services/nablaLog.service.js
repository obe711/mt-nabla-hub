const httpStatus = require('http-status');
const { InfoLog, WarnLog, ErrorLog } = require('../models');
const ApiError = require('../utils/ApiError');


/**
 * Create a nabla log
 * @param {Object} body
 * @returns {Promise<NablaError>}
 */
const createNablaLog = async (body) => {
  switch (body?.level) {
    case "info": {
      return InfoLog.create(body);
    }
    case "warn": {
      return WarnLog.create(body);
    }
    case "error": {
      return ErrorLog.create(body);
    }
    default:
      return;
  }
};

/**
 * Query for Logs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} search - Text string to search in search fields
 * @returns {Promise<QueryResult>}
 */
const queryNablaLogs = (level, filter, options, search) => {
  switch (level) {
    case "info": {
      return InfoLog.paginate(filter, options, search);
    }
    case "warn": {
      return WarnLog.paginate(filter, options, search);
    }
    case "error": {
      return ErrorLog.paginate(filter, options, search);
    }
    default:
      return;
  }
};

module.exports = {
  createNablaLog,
  queryNablaLogs
};