const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { accessLogService } = require('../services');



const getAccessLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['method', 'host', 'hostname']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { search } = pick(req.query, ['search']);
  const result = await accessLogService.queryAccessLogs(filter, options, search);

  res.send(result);
});

const getAccessLog = catchAsync(async (req, res) => {
  const accessLog = await accessLogService.getAccessLogById(req.params.accessLogId);
  if (!accessLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AccessLog not found');
  }
  res.send(accessLog);
});



module.exports = {
  getAccessLogs,
  getAccessLog,
};