const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { nablaLogService } = require('../services');



const getNablaLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['siteName', 'hostname']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { search } = pick(req.query, ['search']);
  const result = await nablaLogService.queryNablaLogs(req.query?.level, filter, options, search);

  res.send(result);
});





module.exports = {
  getNablaLogs,

};