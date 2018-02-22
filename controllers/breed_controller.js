const BlueBird = require('bluebird');
const isFalsey = require('falsey');
const _ = require('underscore');
const utils = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names

const Base_Controller = require('./base_controller');
const enum_controller = require('./enum_controller');
const { Breed } = require('../database/models');
// const Mouse = require('../database/models').Mouse

class Breed_Controller extends Base_Controller {
    pretty(model) {
        return BlueBird.props({
            genotype: model.getGenotype(),
            mice: model.getMice(),
            note: model.getNote(),
            sex_enums: enum_controller.by_type('SEX'),
        })
            .then(({
                genotype, mice, note, sex_enums,
            }) => {
                const pretty_model = {};

                const sex_map = {};
                sex_enums.forEach(sex => sex_map[sex.id] = sex.description);
                const mice_group_by_sex = _.groupBy(mice, mouse => sex_map[mouse.sex_id]);
                if (!isFalsey(mice_group_by_sex)) {
                    const male = mice_group_by_sex.male[0];
                    pretty_model.male_mouse = {
                        id: male.id_alias,
                        age: utils.relative_time(male.dob),
                    };

                    const female = mice_group_by_sex.female[0];
                    pretty_model.female_mouse = {
                        id: female.id_alias,
                        age: utils.relative_time(female.dob),
                    };
                } else {
                    pretty_model.male_mouse = '';
                    pretty_model.female_mouse = '';
                }


                pretty_model.id = parseInt(model.id, 10);
                pretty_model.id_alias = parseInt(model.id_alias, 10);
                pretty_model.ween_date = isFalsey(model.ween_date) ? '' : utils.format_date(model.ween_date);
                pretty_model.female_count = model.female_count;
                pretty_model.genotype = isFalsey(genotype) ? '' : genotype.description;
                pretty_model.genotype_id = isFalsey(genotype) ? '' : genotype.id;
                pretty_model.litter_date = isFalsey(model.litter_date) ? '' : utils.format_date(model.litter_date);
                pretty_model.male_count = model.male_count;
                pretty_model.note = isFalsey(note) ? '' : note.text;
                pretty_model.pairing_date = isFalsey(model.pairing_date) ? '' : utils.format_date(model.pairing_date);
                pretty_model.plug_date = isFalsey(model.plug_date) ? '' : utils.format_date(model.plug_date);
                pretty_model.pup_check_date = isFalsey(model.pup_check_date) ? '' : utils.format_date(model.pup_check_date);
                pretty_model.setup_date = isFalsey(model.setup_date) ? '' : utils.format_date(model.setup_date);
                pretty_model.update_date = isFalsey(model.update_date) ? '' : utils.format_date(model.update_date);


                return pretty_model;
            });
    }
    all_pretty() {
        const self = this;
        return super.all().then(items => BlueBird.map(items, item => self.pretty(item)))
            .then(model_array => model_array);
    }
    by_id_alias(_id_alias) {
        const self = this;
        return this.get_where({ id_alias: _id_alias })
            .then(x => self.pretty(x[0]));
    }

    insert(model_original) {
        const model = utils.remove_empty(model_original, true);
        return Breed.create(model, {
            include: [{ association: Breed.Note }],
            returning: true,
        })
            .catch((err) => {
                console.log(err);
            });
    }
    update(model_original) {
        const model_clean = utils.remove_empty(model_original, true);
        return Breed.update(model_clean, {
            where: { id: model_clean.id },
            returning: true,
        })
            .then(updated_model => BlueBird.props({
                note: updated_model[1][0].getNote(),
                model: updated_model[1][0],
            }))
            .then(({ note, model }) => {
                isFalsey(note) ? model.createNote(model.note) : note.update(model.note);
            });
    }
}

module.exports = new Breed_Controller(Breed);
