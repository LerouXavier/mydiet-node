const express = require('express');

const auth = require('../auth');

const {getProportions} = require('../proportion/proportion-service');
const {getTemplates} = require('../template/template-service');

let router = express.Router();

router.get("/v1/dashboard", auth.loginRequired, (req, res) => {
  return res.json({
      proportions: getProportions(),
      templates: getTemplates()
  });
});

module.exports = router;
