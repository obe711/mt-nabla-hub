const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const siteValidation = require('../../validations/site.validation');
const siteController = require('../../controllers/site.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageSites'), validate(siteValidation.createSite), siteController.createSite)
  .get(validate(siteValidation.getSites), siteController.getSites);

router
  .route('/:siteId')
  .get(auth('getSites'), validate(siteValidation.getSite), siteController.getSite)
  .patch(auth('manageSites'), validate(siteValidation.updateSite), siteController.updateSite)
  .delete(auth('manageSites'), validate(siteValidation.deleteSite), siteController.deleteSite);

module.exports = router;
