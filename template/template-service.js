const _find = require('lodash/find');
const _findIndex = require('lodash/findIndex');
const _merge = require('lodash/merge');

const templates = [
    {
        _id: 'a4c4cb8b-bf32-4d92-8006-0c34a50dabc2',
        name: 'Plan Żywieniowy',
        created: "2018-09-10T23:59:59.999+02:00",
        modified: "2018-09-16T16:23:03.891+02:00",
        description: 'Główny plan żywieniowy.',
        label: 'main',
        html: '<h2>Adam Piwko</h2><'
    },
    {
        _id: 'c0e051f3-fded-4c83-9da4-aa5bf28d635e',
        name: 'Tabela 5 posiłków',
        created: "2018-09-10T23:59:59.999+02:00",
        modified: "2018-09-16T16:23:03.891+02:00",
        description: 'Szablon tabeli zawierający 5 posiłków.',
        label: 'element',
        
    }
];

module.exports.getTemplates = function () {
    return templates;
};

module.exports.getTemplate = function (_id) {
    return _find(templates, {_id});
};

module.exports.createTemplate = function ({name, calories, protein, carbohydrates, fats}) {
    templates.push({
        name,
        calories,
        protein,
        carbohydrates,
        fats
    });
};

module.exports.updateTemplate = function (_id, {name, calories, protein, carbohydrates, fats}) {
    const oldTemplate = _find(templates, {_id});
    const newTemplate = _merge(oldTemplate, {name, calories, protein, carbohydrates, fats});
    const index = _findIndex(templates, {_id});
    templates.splice(index, 1, newTemplate);
};

module.exports.deleteTemplate = function (_id) {
    const index = _findIndex(templates, {_id});
    templates.splice(index, 1);
};