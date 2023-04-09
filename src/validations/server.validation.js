const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createServer = {
  body: Joi.object().keys({
    ip: Joi.string().required(),
    provider: Joi.string().required().valid('aws', 'digitalocean', 'azure'),
  }),
};

const getServers = {
  query: Joi.object().keys({
    provider: Joi.string().valid('aws', 'digitalocean', 'azure').allow(''),
    search: Joi.string().allow(''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getServer = {
  params: Joi.object().keys({
    serverId: Joi.string().custom(objectId),
  }),
};

const updateServer = {
  params: Joi.object().keys({
    serverId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      ip: Joi.string(),
      provider: Joi.string().valid('aws', 'digitalocean', 'azure'),
    })
    .min(1),
};

const deleteServer = {
  params: Joi.object().keys({
    serverId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createServer,
  getServers,
  getServer,
  updateServer,
  deleteServer,
};
