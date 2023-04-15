const httpStatus = require('http-status');
const { Site } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a site
 * @param {Object} siteBody
 * @returns {Promise<Site>}
 */
const createSite = async (siteBody) => {
  if (await Site.isSiteNameTaken(siteBody.siteName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'site name already taken');
  }
  return Site.create(siteBody);
};

/**
 * Query for sites
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} search - Text string to search in search fields
 * @returns {Promise<QueryResult>}
 */
const querySites = async (filter, options, search) => {
  const sites = await Site.paginate(filter, options, search);
  return sites;
};

const getAllSites = async () => {
  return Site.find({});
};

/**
 * Get site by id
 * @param {ObjectId} id
 * @returns {Promise<Site>}
 */
const getSiteById = async (id) => {
  return Site.findById(id);
};

/**
 * Get site by siteName
 * @param {string} siteName
 * @returns {Promise<Site>}
 */
const getSiteBySiteName = async (siteName) => {
  return Site.findOne({ siteName });
};

const upsertSite = (siteBody) => {
  return Site.findOneAndUpdate({ siteName: siteBody.siteName }, siteBody, { upsert: true, useFindAndModify: false });
};

/**
 * Update site by id
 * @param {ObjectId} siteId
 * @param {Object} updateBody
 * @returns {Promise<Site>}
 */
const updateSiteById = async (siteId, updateBody) => {
  const site = await getSiteById(siteId);
  if (!site) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Site not found');
  }
  if (updateBody.ip && (await Site.isSiteNameTaken(updateBody.siteName, siteId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'site name already taken');
  }
  Object.assign(site, updateBody);
  await site.save();
  return site;
};

/**
 * Delete site by id
 * @param {ObjectId} siteId
 * @returns {Promise<Site>}
 */
const deleteSiteById = async (siteId) => {
  const site = await getSiteById(siteId);
  if (!site) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Site not found');
  }
  await site.remove();
  return site;
};

module.exports = {
  createSite,
  querySites,
  getAllSites,
  getSiteById,
  getSiteBySiteName,
  upsertSite,
  updateSiteById,
  deleteSiteById,
};
