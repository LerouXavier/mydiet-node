const express                                                                               = require('express');
const auth                                                                                  = require('../auth');
const {getTemplates, getTemplate, createTemplate, updateTemplate, deleteTemplate} = require('./template-service');

let router = express.Router();

router.get('/v1/templates', auth.loginRequired, (req, res) => {
    return res.json(getTemplates());
});

router.get('/v1/templates/:id', auth.loginRequired, (req, res) => {
    return res.json(getTemplate(req.params.id));
});

router.post('/v1/templates', auth.loginRequired, (req, res) => {
    createTemplate(req.body);
    return res.status(201).send();
});

router.put('/v1/templates/:id', auth.loginRequired, (req, res) => {
    const {params, body} = req;
    updateTemplate(params.id, body);
    return res.send();
});

router.delete('/v1/templates/:id', auth.loginRequired, (req, res) => {
    deleteTemplate(req.params.id);
    return res.send();
});

module.exports = router;
