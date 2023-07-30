const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
//const serverValidation = require('../../validations/accessLog.validation');
const accessLogController = require('../../controllers/accessLog.controller');

const router = express.Router();

router
  .route('/')
  .get(accessLogController.getAccessLogs);

router
  .route('/:accessLogId')
  .get(accessLogController.getAccessLog);
// .patch(auth('manageServers'), validate(serverValidation.updateServer), serverController.updateServer)
// .delete(auth('manageServers'), validate(serverValidation.deleteServer), serverController.deleteServer);

module.exports = router;