const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

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
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
// warnLogSchema.plugin(toJSON);
warnLogSchema.plugin(paginate);

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