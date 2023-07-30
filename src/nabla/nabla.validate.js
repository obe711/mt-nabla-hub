const Joi = require('joi');

const getNablaStats = {
  query: Joi.object().keys({
    nabla: Joi.string().required(),
  }),
};

module.exports = {
  getNablaStats,
};