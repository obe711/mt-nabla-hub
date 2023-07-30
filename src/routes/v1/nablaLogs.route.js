const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
//const serverValidation = require('../../validations/nablaError.validation');
const nablaLogController = require('../../controllers/nablaLog.controller');

const router = express.Router();

router
  .route('/')
  .get(nablaLogController.getNablaLogs);

// router
//   .route('/:nablaLogId')
//   .get(nablaLogController.getNablaLog);
// .patch(auth('manageServers'), validate(serverValidation.updateServer), serverController.updateServer)
// .delete(auth('manageServers'), validate(serverValidation.deleteServer), serverController.deleteServer);

module.exports = router;