const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const siteSchema = mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      trim: true,
      enum: ['0', '1', '2'],
    },
    req: {
      type: String,
      default: '0.0',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
siteSchema.plugin(toJSON);
siteSchema.plugin(paginate);

/**
 * Return paths to text search in paginate plugin
 * @returns {Array<string>}
 */
siteSchema.statics.searchableFields = function () {
  return ['siteName'];
};

/**
 * Check if site siteName is taken
 * @param {string} siteName - The site's hostname
 * @param {ObjectId} [excludeSiteId] - The id of the site to be excluded
 * @returns {Promise<boolean>}
 */
siteSchema.statics.isSiteNameTaken = async function (siteName, excludeSiteId) {
  const site = await this.findOne({ siteName, _id: { $ne: excludeSiteId } });
  return !!site;
};

/**
 * @typedef Site
 */
const Site = mongoose.model('Site', siteSchema);

module.exports = Site;
