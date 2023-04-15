const axios = require('axios');
const config = require('../config/config');

const nablaCaller = axios.create();

nablaCaller.interceptors.request.use(
  function (req) {
    req.meta = req.meta || {};
    req.meta.requestStartedAt = new Date().getTime();
    return req;
  },
  function (error) {
    return Promise.reject(error);
  }
);

nablaCaller.interceptors.response.use(
  (res) => {
    res.durationInMs = new Date().getTime() - res.config.meta.requestStartedAt;
    return res;
  },
  (res) => {
    res.durationInMs = new Date().getTime() - res.config.meta.requestStartedAt;
    throw res;
  }
);

const getSiteStats = (siteName) => {
  return nablaCaller.get(`https://${siteName}/nabla?nabla=${config.nablaApiKey}`);
};

module.exports = {
  getSiteStats,
};
