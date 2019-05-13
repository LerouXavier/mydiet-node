const express                                                                               = require('express');
const {getTemplates, getTemplate, createTemplate, updateTemplate, deleteTemplate} = require('./template.service');

let router = express.Router();

router.get('/v1/templates', (req, res) => {
    return res.json(getTemplates());
});

router.get('/v1/templates/:id', (req, res) => {
    return res.json(getTemplate(req.params.id));
});

router.post('/v1/templates', (req, res) => {
    createTemplate(req.body);
    return res.status(201).send();
});

router.put('/v1/templates/:id', (req, res) => {
    const {params, body} = req;
    updateTemplate(params.id, body);
    return res.send();
});

router.delete('/v1/templates/:id', (req, res) => {
    deleteTemplate(req.params.id);
    return res.send();
});

module.exports = router;
