const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const serverValidation = require('../../validations/server.validation');
const serverController = require('../../controllers/server.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageServers'), validate(serverValidation.createServer), serverController.createServer)
  .get(validate(serverValidation.getServers), serverController.getServers);

router
  .route('/:serverId')
  .get(auth('getServers'), validate(serverValidation.getServer), serverController.getServer)
  .patch(auth('manageServers'), validate(serverValidation.updateServer), serverController.updateServer)
  .delete(auth('manageServers'), validate(serverValidation.deleteServer), serverController.deleteServer);

module.exports = router;