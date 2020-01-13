const BlueBird = require('bluebird');
const isFalsey = require('falsey');

const utils = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names;

const Base_Controller = require('./base_controller');
const { Experiment } = require('../database/models');


class Experiment_Controller extends Base_Controller {
    pretty(model) {
        return {};
        // const self = this;
        // return BlueBird.props({
        //     type: model.getType(),
        //     mice: model.getMice(),
        //     note: model.getNote(),
        // })
        //     .then(({ type, mice, note }) => {
        //         const pretty_model = {};

        //         pretty_model.id = model.id;
        //         pretty_model.id_alias = model.id_alias;
        //         pretty_model.note = isFalsey(note) ? '' : note.text;
        //         pretty_model.type = isFalsey(type) ? '' : type.description;
        //         pretty_model.type_id = isFalsey(type) ? '' : `${type.id}`;
        //         pretty_model.end_date = utils.format_date(model.end_date);
        //         pretty_model.mice = mice;
        //         pretty_model.mouse_ids = mice.map((m) => `${m.id}`);
        //         return pretty_model;
        //     })
        //     .catch((err) => {
        //         utils.log_json(err);
        //     });
    }

    all_pretty() {
        const self = this;
        return super.all().then((items) => BlueBird.map(items, (item) => self.pretty(item)))
            .then((model_array) => model_array);
    }

    insert(model) {
        // const self = this;
        const _model = utils.remove_empty(model, true);
        // if(isFalsey(_model.name)){
        //     _model.name = city_names[Math.floor(Math.random() * city_names.length)]
        // }
       
        return Experiment.create(_model,  {
            include: [{ association: Experiment.Projects }],
            returning: true,
        })
            .catch((err) => {
                console.error(err);
            });
    }

    update(model) {
        const _model = utils.remove_empty(model, true);

        return Experiment.update(_model, {
            where: { id: _model.id },
            returning: true,
        });
    }

    get model() {
        return Experiment;
    }
}

module.exports = new Experiment_Controller(Experiment);
