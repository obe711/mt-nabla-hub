const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const config = require('../config/config');

const warnLogSchema = mongoose.Schema(
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
// warnLogSchema.plugin(toJSON);
warnLogSchema.plugin(paginate);

warnLogSchema.index({ expireAt: 1 }, { expires: config.mongoose.expireAfterSec });

/**
 * Return paths to text search in paginate plugin
 * @returns {Array<string>}
 */
warnLogSchema.statics.searchableFields = function () {
  return ['siteName', 'hostname', 'log'];
};



/**
 * @typedef WarnLog
 */
const WarnLog = mongoose.model('WarnLog', warnLogSchema);

module.exports = WarnLog;