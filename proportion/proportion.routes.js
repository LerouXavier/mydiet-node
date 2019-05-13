const express = require('express');
const {
    getProportions,
    getProportion,
    createProportion,
    updateProportion,
    deleteProportion
} = require('./proportion.service');

let router = express.Router();

router.get('/v1/proportions',
    (req, res) => {
    return res.json(getProportions());
}
);

router.post('/v1/proportions',
    (req, res) => {
        createProportion(req.body);
        return res.status(201).send();
    }
);

router.get('/v1/proportions/:id',
    (req, res) => {
    return res.json(getProportion(req.params.id));
}
);

router.put('/v1/proportions/:id',
    (req, res) => {
        const {params, body} = req;
        updateProportion(params.id, body);
        return res.send();
    }
);

router.delete('/v1/proportions/:id',
    (req, res) => {
        deleteProportion(req.params.id);
        return res.send();
    }
);

module.exports = router;
