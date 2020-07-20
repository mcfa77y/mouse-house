const BlueBird = require('bluebird');
const { falsy: isFalsey } = require('is_js');

const { format_date, log_json, remove_empty } = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names;

const Base_Controller = require('./base_controller');
const { Cage } = require('../database/models');
const { Mouse } = require('../database/models');

class Cage_Controller extends Base_Controller {
    async pretty(model) {
        return BlueBird.props({
            type: model.getType(),
            mice: model.getMice(),
            note: model.getNote(),
        })
            .then(({ type, mice, note }) => {
                const pretty_model = {};

                pretty_model.id = model.id;
                pretty_model.id_alias = model.id_alias;
                pretty_model.note = isFalsey(note) ? '' : note.text;
                pretty_model.type = isFalsey(type) ? '' : type.description;
                pretty_model.type_id = isFalsey(type) ? '' : `${type.id}`;
                pretty_model.end_date = format_date(model.end_date);
                pretty_model.mice = mice;
                pretty_model.mouse_ids = mice.map((m) => `${m.id}`);
                return pretty_model;
            })
            .catch((err) => {
                log_json(err);
            });
    }

    all_pretty() {
        const self = this;
        return super.all().then((items) => BlueBird.map(items, (item) => self.pretty(item)))
            .then((model_array) => model_array);
    }

    by_id_alias(_id_alias) {
        const self = this;
        return this.get_where({ id_alias: _id_alias })
            .then((x) => self.pretty(x[0]))
            .catch((err) => log_json(err));
    }

    insert(model) {
        const _model = remove_empty(model, true);
        // if(isFalsey(_model.name)){
        //     _model.name = city_names[Math.floor(Math.random() * city_names.length)]
        // }
        return Cage.create(_model, {
            include: [{ association: Cage.Note }],
            returning: true,
        })
            .then((nu_model) => {
                if (isFalsey(_model.id_alias)) {
                    nu_model.update({ id_alias: `c${nu_model.id}` });
                }
                if (!isFalsey(_model.mouse_ids)) {
                    Mouse.update(
                        { cage_id: nu_model.id },
                        { where: { id: { $in: _model.mouse_ids } } },
                    );
                }
                return nu_model;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    update(model) {
        const _model = remove_empty(model, true);

        return Cage.update(_model, {
            where: { id: _model.id },
            include: [
                { association: Cage.Note },
                { association: Cage.Mice },
                { association: Cage.Type }],
            returning: true,
        })
            .then((updated_cage) => {
                const m = updated_cage[1][0];
                return BlueBird.props({
                    mice: m.getMice(),
                    note: m.getNote(),
                    cage: m,
                });
            })
            .then(({ mice, note, cage }) => {
                if (note == null) {
                    cage.createNote(_model.note);
                } else {
                    note.update(_model.note);
                }

                if (!isFalsey(mice)) {
                    // remove old mouse-cage connections
                    mice.filter((mouse) => !_model.mouse_ids.includes(`${mouse.id}`)).forEach((mouse) => {
                        mouse.update({ cage_id: null });
                    });
                }

                // add new mouse-cage connections
                Mouse.update({ cage_id: cage.id }, { where: { id: { $in: _model.mouse_ids } } });
            });
    }

    get model() {
        return Cage;
    }
}

module.exports = new Cage_Controller(Cage);
