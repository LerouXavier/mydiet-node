const express                                                                               = require('express');
const auth                                                                                  = require('../auth');
const {getProportions, getProportion, createProportion, updateProportion, deleteProportion} = require('./proportion-service');

let router = express.Router();

router.get('/v1/proportions', auth.loginRequired, (req, res) => {
    return res.json(getProportions());
});

router.get('/v1/proportions/:id', auth.loginRequired, (req, res) => {
    return res.json(getProportion(req.params.id));
});

router.post('/v1/proportions', auth.loginRequired, (req, res) => {
    createProportion(req.body);
    return res.status(201).send();
});

router.put('/v1/proportions/:id', auth.loginRequired, (req, res) => {
    const {params, body} = req;
    updateProportion(params.id, body);
    return res.send();
});

router.delete('/v1/proportions/:id', auth.loginRequired, (req, res) => {
    deleteProportion(req.params.id);
    return res.send();
});

module.exports = router;
