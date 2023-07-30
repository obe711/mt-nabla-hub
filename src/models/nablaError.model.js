const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const nablaErrorSchema = mongoose.Schema(
  {
    user: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true
    },
    hostname: {
      type: String,
      trim: true,
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
// nablaErrorSchema.plugin(toJSON);
nablaErrorSchema.plugin(paginate);

/**
 * Return paths to text search in paginate plugin
 * @returns {Array<string>}
 */
nablaErrorSchema.statics.searchableFields = function () {
  return ['user', 'code', 'message', 'hostname'];
};



/**
 * @typedef NablaError
 */
const NablaError = mongoose.model('NablaError', nablaErrorSchema);

module.exports = NablaError;