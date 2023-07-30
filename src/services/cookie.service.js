const config = require('../config/config');

/**
 * Set Token Cookie
 * @param {Response<object>} res
 * @param {object} tokenData
 */
const setTokenCookie = (res, tokenData) => {
  const { expires, token } = tokenData;
  const cookieRefreshOptions = {
    httpOnly: true,
    expires: new Date(expires),
  };
  res.cookie(config.jwt.refreshCookieName, token, cookieRefreshOptions);
};

const setAppleTokenCookie = (res, tokenData) => {
  const cookieAppleOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 3600 * 1000),
  };
  res.cookie('x-a-id', tokenData, cookieAppleOptions);
};

/**
 * Expire Token Cookie
 * @param {Response<object>} res
 */
const expireTokenCookie = (res) => {
  const expireCookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() - 60 * 1000 * 60 * 24 * 31),
  };
  res.cookie(config.jwt.refreshCookieName, 'x', expireCookieOptions);
};

module.exports = {
  setTokenCookie,
  expireTokenCookie,
  setAppleTokenCookie
};
