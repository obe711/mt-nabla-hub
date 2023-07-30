const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { appleService, apnService } = require('../services');



const dev = catchAsync(async (req, res) => {
  // const token = await appleService.createClientSecret();
  // res.send({ token })
  apnService.sendPushNotification();
  res.send({ ok: "ok" })
});





module.exports = {
  dev,

};