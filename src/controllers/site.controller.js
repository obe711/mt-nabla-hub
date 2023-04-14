const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { siteService } = require('../services');

const createSite = catchAsync(async (req, res) => {
  const site = await siteService.createSite(req.body);
  res.status(httpStatus.CREATED).send(site);
});

const getSites = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['provider']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { search } = pick(req.query, ['search']);
  const result = await siteService.querySites(filter, options, search);
  res.send(result);
});

const getSite = catchAsync(async (req, res) => {
  const site = await siteService.getSiteById(req.params.siteId);
  if (!site) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Site not found');
  }
  res.send(site);
});

const updateSite = catchAsync(async (req, res) => {
  const site = await siteService.updateSiteById(req.params.siteId, req.body);
  res.send(site);
});

const deleteSite = catchAsync(async (req, res) => {
  await siteService.deleteSiteById(req.params.siteId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSite,
  getSites,
  getSite,
  updateSite,
  deleteSite,
};
