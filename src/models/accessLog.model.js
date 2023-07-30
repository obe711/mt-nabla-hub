const mongoose = require('mongoose');
const { toJSON, paginate } = require('../models/plugins');
const config = require('../config/config');

const accessLogSchema = mongoose.Schema(
  {
    tsId: { type: String, unique: true },
    address: { type: String },
    ts: { type: String },
    method: { type: String },
    host: { type: String },
    hostname: { type: String },
    request: { type: String },
    requestUri: { type: String },
    uri: { type: String },
    status: { type: Number },
    bytes: { type: Number },
    referer: { type: String },
    agent: { type: String },
    args: { type: String },
    duration: {
      request: { type: Number, default: 0 },
      connect: { type: Number, default: 0 },
      header: { type: Number, default: 0 },
      response: { type: Number, default: 0 },
    },
    expireAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

accessLogSchema.plugin(toJSON);
accessLogSchema.plugin(paginate);

accessLogSchema.index({ expireAt: 1 }, { expires: config.mongoose.expireAfterSec });

accessLogSchema.statics.searchableFields = function () {
  return ['address', 'uri', 'requestUri'];
};

/**
 * @typedef AccessLog
 */
const AccessLog = mongoose.model('AccessLog', accessLogSchema);

module.exports = AccessLog;