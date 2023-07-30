const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
//const serverValidation = require('../../validations/nablaError.validation');
const nablaErrorController = require('../../controllers/nablaError.controller');

const router = express.Router();

router
  .route('/')
  .get(nablaErrorController.getNablaErrors);

router
  .route('/:nablaErrorId')
  .get(nablaErrorController.getNablaError);
// .patch(auth('manageServers'), validate(serverValidation.updateServer), serverController.updateServer)
// .delete(auth('manageServers'), validate(serverValidation.deleteServer), serverController.deleteServer);

module.exports = router;