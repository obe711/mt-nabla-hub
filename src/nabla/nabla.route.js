const express = require('express');
const validate = require('../middlewares/validate');
const catchAsync = require('../utils/catchAsync');

const auth = require('./nabla.auth');
const nablaValidation = require('./nabla.validate');
const nablaService = require('./nabla.service');
const packageJson = require('../../package.json');

const router = express.Router();

router.route('/').get(
  auth(),
  validate(nablaValidation.getNablaStats),
  catchAsync(async (req, res) => {
    const { collections, objects, dataSize } = await nablaService.getDbStats();
    const userCount = await nablaService.getUserCount();
    res.status(200).send({ collections, records: objects, dbSize: dataSize, version: packageJson.version, userCount });
  })
);

module.exports = router;