const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { serverService } = require('../services');

const createServer = catchAsync(async (req, res) => {
  const server = await serverService.createServer(req.body);
  res.status(httpStatus.CREATED).send(server);
});

const getServers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['provider']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { search } = pick(req.query, ['search']);
  const result = await serverService.queryServers(filter, options, search);
  res.send(result);
});

const getServer = catchAsync(async (req, res) => {
  const server = await serverService.getServerById(req.params.serverId);
  if (!server) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Server not found');
  }
  res.send(server);
});

const updateServer = catchAsync(async (req, res) => {
  const server = await serverService.updateServerById(req.params.serverId, req.body);
  res.send(server);
});

const deleteServer = catchAsync(async (req, res) => {
  await serverService.deleteServerById(req.params.serverId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createServer,
  getServers,
  getServer,
  updateServer,
  deleteServer,
};
