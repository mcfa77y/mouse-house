const BlueBird = require('bluebird');

const enum_controller = require('../controllers/enum_controller');
const mouse_controller = require('../controllers/mouse_controller');
const { build_note } = require('./utils_routes');

module.exports = {

    get_breed_inputs: () => BlueBird.props({
        genotype: enum_controller.by_type('MOUSE_GENOTYPE'),
        male_mice: mouse_controller.by_sex('male'),
        female_mice: mouse_controller.by_sex('female'),
    }),

    create_model: (_model) => {
        const model = _model;
        model.note = build_note(_model);
        model.male_id = _model.male_mouse;
        model.female_id = _model.female_mouse;
        return model;
    },
};
