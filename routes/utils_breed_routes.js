const BlueBird = require('bluebird');

const enum_controller = require('../controllers/enum_controller');
const mouse_controller = require('../controllers/mouse_controller');
const utils = require('./utils_routes');

module.exports = {

    get_breed_inputs: () => BlueBird.props({
        genotype: enum_controller.by_type('MOUSE_GENOTYPE'),
        male_mice: mouse_controller.by_sex('male'),
        female_mice: mouse_controller.by_sex('female'),
    }),

    create_model: (req) => {
        const model = req.body;
        model.note = utils.build_note(req);
        model.male_id = req.body.male_mouse;
        model.female_id = req.body.female_mouse;
        return model;
    },
};
