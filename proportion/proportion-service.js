const _find = require('lodash/find');
const _findIndex = require('lodash/findIndex');
const _merge = require('lodash/merge');

const proportions = [
    {
        _id: 'c0e051f3-fded-4c83-9da4-aa5bf28d635e',
        name: 'Extra Light',
        calories: 1200,
        protein: 28,
        carbohydrates: 36,
        fats: 36
    },
    {
        _id: 'a4c4cb8b-bf32-4d92-8006-0c34a50dabc2',
        name: 'Light',
        calories: 1500,
        protein: 28,
        carbohydrates: 36,
        fats: 36
    },
    {
        _id: '9294a582-d45d-4db9-b36e-eaba30f5131c',
        name: 'Regular',
        calories: 1800,
        protein: 28,
        carbohydrates: 36,
        fats: 36
    },
    {
        _id: 'e62154fc-92dc-4a99-ba39-3d1303beafd6',
        name: 'Medium',
        calories: 2000,
        protein: 28,
        carbohydrates: 36,
        fats: 36
    },
    {
        _id: 'b0a9451d-9f75-4b0e-b3a0-7786b7cd5857',
        name: 'Heavy',
        calories: 2200,
        protein: 28,
        carbohydrates: 36,
        fats: 36
    },
    {
        _id: '835fc86a-06e3-4f86-b1cc-47e8e6c8abff',
        name: 'Pro',
        calories: 2800,
        protein: 28,
        carbohydrates: 36,
        fats: 36
    }
];

module.exports.getProportions = function () {
    return proportions;
};

module.exports.getProportion = function (_id) {
    return _find(proportions, {_id});
};

module.exports.createProportion = function ({name, calories, protein, carbohydrates, fats}) {
    proportions.push({
        name,
        calories,
        protein,
        carbohydrates,
        fats
    });
};

module.exports.updateProportion = function (_id, {name, calories, protein, carbohydrates, fats}) {
    const oldProportion = _find(proportions, {_id});
    const newProportion = _merge(oldProportion, {name, calories, protein, carbohydrates, fats});
    const index = _findIndex(proportions, {_id});
    proportions.splice(index, 1, newProportion);
};

module.exports.deleteProportion = function (_id) {
    const index = _findIndex(proportions, {_id});
    proportions.splice(index, 1);
};