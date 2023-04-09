const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');


const serverSchema = mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      enum: ["aws", "digitalocean", "azure"],
    },
    ip: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
serverSchema.plugin(toJSON);
serverSchema.plugin(paginate);

/**
 * Return paths to text search in paginate plugin
 * @returns {Array<string>}
 */
serverSchema.statics.searchableFields = function () {
  return ['ip'];
};

/**
 * Check if ip is taken
 * @param {string} ip - The server's ip address
 * @param {ObjectId} [excludeServerId] - The id of the server to be excluded
 * @returns {Promise<boolean>}
 */
serverSchema.statics.isIpTaken = async function (ip, excludeServerId) {
  const server = await this.findOne({ ip, _id: { $ne: excludeServerId } });
  return !!server;
};


/**
 * @typedef Server
 */
const Server = mongoose.model('Server', serverSchema);

module.exports = Server;
