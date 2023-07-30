const requestIp = require('request-ip');

const clientIP = (req, res, next) => {
  req.clientIP = requestIp.getClientIp(req);
  next();
};

module.exports = clientIP;