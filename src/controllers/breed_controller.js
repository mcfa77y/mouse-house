const BlueBird = require('bluebird');
const isFalsey = require('falsey');

const {
    remove_empty, relative_time, option_date, option,
} = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names

const Base_Controller = require('./base_controller');

const { Breed } = require('../database/models');
// const Mouse = require('../database/models').Mouse

class Breed_Controller extends Base_Controller {
    pretty(model) {
        return BlueBird.props({
            genotype: model.getGenotype(),
            male: model.getMale(),
            female: model.getFemale(),
            note: model.getNote(),
        })
            .then(({
                genotype, male, female, note,
            }) => {
                const pretty_model = {};
                try {
                    const reshape_mouse_data = mouse => ({
                        id: option(mouse.id_alias, -1),
                        age: option_date(mouse.dob),
                    });
                    pretty_model.male_mouse = option(male, { id: -1, age: relative_time('01/01/1970') }, reshape_mouse_data);
                    pretty_model.female_mouse = option(female, { id: -1, age: relative_time('01/01/1970') }, reshape_mouse_data);

                    pretty_model.id = parseInt(model.id, 10);
                    pretty_model.id_alias = option(model.id_alias, -1);
                    pretty_model.ween_date = option_date(model.ween_date);
                    pretty_model.female_count = option(model.female_count, 0);
                    pretty_model.genotype = option(genotype);
                    pretty_model.genotype_id = option(genotype);
                    pretty_model.litter_date = option_date(model.litter_date);
                    pretty_model.male_count = option(model.male_count, 0);
                    pretty_model.unknown_count = option(model.unknown_count, 0);
                    pretty_model.note = option(note, '', x => x.dataValues.text);
                    pretty_model.pairing_date = option_date(model.pairing_date);
                    pretty_model.plug_date = option_date(model.plug_date);
                    pretty_model.pup_check_date = option_date(model.pup_check_date);
                    pretty_model.setup_date = option_date(model.setup_date);
                    pretty_model.update_date = option_date(model.update_date);
                } catch (err) {
                    console.error(err);
                }

                return pretty_model;
            });
    }
    all_pretty() {
        const self = this;
        return super.all()
            .then(items => BlueBird.map(items, item => self.pretty(item)))
            .then(model_array => model_array.filter(model => !isFalsey(model)));
    }
    by_id_alias(_id_alias) {
        const self = this;
        return this.get_where({ id_alias: _id_alias })
            .then(x => self.pretty(x[0]));
    }

    insert(model_original) {
        const self = this;
        const model = remove_empty(model_original, true);
        return Breed.create(model, {
            include: [
                { association: Breed.Note },
                { association: Breed.Male },
                { association: Breed.Female },
            ],
            returning: true,
        })
            .catch((err) => {
                console.log(err);
            });
    }
    update(model_original) {
        const self = this;
        const tmp_model = remove_empty(model_original, true);
        return Breed.update(tmp_model, {
            where: { id: tmp_model.id },
            include: [
                { association: Breed.Note },
                { association: Breed.Mouse },
            ],
            returning: true,
        })
            .then((updated_model) => {
                const model = updated_model[1][0];
                return BlueBird.props({
                    note: model.getNote(),
                    model,
                });
            })
            .then(({ note, model }) => {
                if (!isFalsey(tmp_model.note)) {
                    isFalsey(note) ? model.createNote(tmp_model.note) : note.update(tmp_model.note);
                }
            })
            .catch(err => console.error(err));
    }
}

module.exports = new Breed_Controller(Breed);
