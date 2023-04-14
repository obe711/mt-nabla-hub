const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSite = {
  body: Joi.object().keys({
    siteName: Joi.string().required(),
  }),
};

const getSites = {
  query: Joi.object().keys({
    search: Joi.string().allow(''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSite = {
  params: Joi.object().keys({
    siteId: Joi.string().custom(objectId),
  }),
};

const updateSite = {
  params: Joi.object().keys({
    siteId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      siteName: Joi.string(),
    })
    .min(1),
};

const deleteSite = {
  params: Joi.object().keys({
    siteId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSite,
  getSites,
  getSite,
  updateSite,
  deleteSite,
};
