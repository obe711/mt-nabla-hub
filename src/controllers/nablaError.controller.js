const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { nablaErrorService } = require('../services');



const getNablaErrors = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', 'code', 'message']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { search } = pick(req.query, ['search']);
  const result = await nablaErrorService.queryNablaErrors({ isFixed: false }, options, search);

  res.send(result);
});

const getNablaError = catchAsync(async (req, res) => {
  const server = await nablaErrorService.getNablaErrorById(req.params.nablaErrorId);
  if (!server) {
    throw new ApiError(httpStatus.NOT_FOUND, 'NablaError not found');
  }
  res.send(server);
});



module.exports = {
  getNablaErrors,
  getNablaError,
};