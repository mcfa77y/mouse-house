import P from 'bluebird';
const BlueBird = P.Promise;

import { Enum_Controller } from '../controllers/enum_controller';
import { Mouse_Controller } from '../controllers/mouse_controller';
import { Cage_Controller } from '../controllers/cage_controller';

// const Enum_Controller = require('../controllers/enum_controller');
// const Mouse_Controller = require('../controllers/mouse_controller');
// const Cage_Controller = require('../controllers/cage_controller');

const { build_note, log_json } = require('./utils_routes');


export const utils = {
    get_inputs: () => BlueBird.props({
        status: Enum_Controller.by_type(Mouse_Controller.STATUS),
        genotype: Enum_Controller.by_type(Mouse_Controller.GENOTYPE),
        cages: Cage_Controller.all_pretty(),
        sex: Enum_Controller.by_type(Mouse_Controller.SEX),
    }),
       

    do_cage_upsert: (model:any) => {
        const cage = {
            id_alias: model.cage_description,
        };
        return Cage_Controller.model
            .findOrCreate({ where: cage })
            .spread((result:any) => result.id)
            .catch((err) => {
                console.log('cage upsert error: ');
                log_json(err);
            });
    },

    do_status_upsert: (model:any) => {
        const status = {
            description: model.status_description,
            type: Mouse_Controller.STATUS,
        };
        return Enum_Controller.model.findOrCreate({ where: status })
            .spread((result:any) => result.id)
            .catch((err) => {
                console.log('status upsert error: ');
                log_json(err);
            });
    },

    do_genotype_upsert: (model:any) => {
        const genotype = {
            description: model.genotype_description,
            type: Mouse_Controller.GENOTYPE,
        };
        return Enum_Controller.model.findOrCreate({ where: genotype })
            .spread((result: any) => result.id)
            .catch((err) => {
                console.log('genotype upsert error: ');
                log_json(err);
            });
    },


    create_model: (model:any) => {
        
        return BlueBird.props({
            cage_id: module.exports.do_cage_upsert(model),
            status_id: module.exports.do_status_upsert(model),
            genotype_id: module.exports.do_genotype_upsert(model),
        })
            .then((ids) => {
                model.cage_id = ids.cage_id;
                model.status_id = ids.status_id;
                model.genotype_id = ids.genotype_id;
                model.note = build_note(model);
                return model;
            });
    },

};
