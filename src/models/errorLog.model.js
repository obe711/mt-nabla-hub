const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const config = require('../config/config');

const errorLogSchema = mongoose.Schema(
  {
    siteName: {
      type: String,
      trim: true,
    },
    hostname: {
      type: String,
      trim: true,
    },
    log: {
      type: String,
      trim: true
    },
    expireAt: {
      type: Date,
      default: Date.now,
    },

  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
// errorLogSchema.plugin(toJSON);
errorLogSchema.plugin(paginate);

errorLogSchema.index({ expireAt: 1 }, { expires: config.mongoose.expireAfterSec });

/**
 * Return paths to text search in paginate plugin
 * @returns {Array<string>}
 */
errorLogSchema.statics.searchableFields = function () {
  return ['siteName', 'hostname', 'log'];
};



/**
 * @typedef ErrorLog
 */
const ErrorLog = mongoose.model('ErrorLog', errorLogSchema);

module.exports = ErrorLog;