const express = require('express');
const passport = require('passport');

const {getProportions} = require('../proportion/proportion.service');
const {getTemplates} = require('../template/template.service');

let router = express.Router();

router.get("/v1/dashboard",
    passport.authenticate('bearer', { session: false }),
    (req, res) => {
  return res.json({
      proportions: getProportions(),
      templates: getTemplates()
  });
});

module.exports = router;
