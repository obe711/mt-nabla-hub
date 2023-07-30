const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const infoLogSchema = mongoose.Schema(
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
// infoLogSchema.plugin(toJSON);
infoLogSchema.plugin(paginate);

/**
 * Return paths to text search in paginate plugin
 * @returns {Array<string>}
 */
infoLogSchema.statics.searchableFields = function () {
  return ['siteName', 'hostname', 'log'];
};



/**
 * @typedef InfoLog
 */
const InfoLog = mongoose.model('InfoLog', infoLogSchema);

module.exports = InfoLog;