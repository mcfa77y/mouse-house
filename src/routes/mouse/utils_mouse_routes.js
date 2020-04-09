const BlueBird = require('bluebird');

const enum_controller = require('../../controllers/enum_controller');
const mouse_controller = require('../../controllers/mouse_controller');
const cage_controller = require('../../controllers/cage_controller');
const { build_note, log_json } = require('../utils_routes');


module.exports = {
    get_inputs: () => BlueBird.props({
        status: enum_controller.by_type(mouse_controller.STATUS),
        genotype: enum_controller.by_type(mouse_controller.GENOTYPE),
        cages: cage_controller.all_pretty(),
        sex: enum_controller.by_type(mouse_controller.SEX),
    })
        .catch((error) => {
            log_json(error);
        }),

    do_cage_upsert: (model) => {
        const cage = {
            id_alias: model.cage_description,
        };
        return cage_controller.model
            .findOrCreate({ where: cage })
            .spread((result) => result.id)
            .catch((err) => {
                console.log('cage upsert error: ');
                log_json(err);
            });
    },

    do_status_upsert: (model) => {
        const status = {
            description: model.status_description,
            type: mouse_controller.STATUS,
        };
        return enum_controller.model.findOrCreate({ where: status })
            .spread((result) => result.id)
            .catch((err) => {
                console.log('status upsert error: ');
                log_json(err);
            });
    },

    do_genotype_upsert: (model) => {
        const genotype = {
            description: model.genotype_description,
            type: mouse_controller.GENOTYPE,
        };
        return enum_controller.model.findOrCreate({ where: genotype })
            .spread((result) => result.id)
            .catch((err) => {
                console.log('genotype upsert error: ');
                log_json(err);
            });
    },


    create_model: (_model) => {
        const model = _model;
        return BlueBird.props({
            cage_id: module.exports.do_cage_upsert(model),
            status_id: module.exports.do_status_upsert(model),
            genotype_id: module.exports.do_genotype_upsert(model),
        })
            .then((ids) => {
                model.cage_id = ids.cage_id;
                model.status_id = ids.status_id;
                model.genotype_id = ids.genotype_id;
                model.note = build_note(_model);
                return model;
            });
    },

};
