import BlueBird from 'bluebird';
const isFalsey = require('falsey');

import { Breed_Instance } from '../database/models/Breed';

const {
    remove_empty, relative_time, option_date, option,
} = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names

import { Base_Controller } from './base_controller';

import { db } from '../database/models';

const { Breed, Note, Mouse } = db;

// const Mouse = require('../database/models').Mouse
type Mouse_T = {
    id?: number;
    age?: string;
}
type Pretty_Breed = {
    id?: number;
    id_alias?: string;
    male_mouse?: Mouse_T;
    female_mouse?: Mouse_T;
    ween_date?: string;
    female_count?: string;
    genotype?: string;
    genotype_id?: string;
    litter_date?: string;
    male_count?: string;
    unknown_count?: string;
    note?: string;
    pairing_date?: string;
    plug_date?: string;
    pup_check_date?: string;
}

class Breed_Controller_Factory extends Base_Controller {
    pretty(model: Breed_Instance) {
        // const self = this;

        return BlueBird.props({
            genotype: model.getGenotype(),
            male: model.getMale(),
            female: model.getFemale(),
            note: model.getNote(),
        })
            .then((
                { genotype,
                    male,
                    female,
                    note }
            ) => {
                const pretty_model: Pretty_Breed = {};

                const reshape_mouse_data = (mouse: any) => ({
                    id: option(mouse.id_alias, -1),
                    age: option_date(mouse.dob),
                });
                pretty_model.male_mouse = option(male, { id: -1, age: relative_time('01/01/1970') }, reshape_mouse_data);
                pretty_model.female_mouse = option(female, { id: -1, age: relative_time('01/01/1970') }, reshape_mouse_data);

                pretty_model.id = model.id;
                pretty_model.id_alias = option(model.id_alias, -1);
                pretty_model.ween_date = option_date(model.ween_date);
                pretty_model.female_count = option(model.female_count, 0);
                pretty_model.genotype = option(genotype);
                pretty_model.genotype_id = option(genotype.id);
                pretty_model.litter_date = option_date(model.litter_date);
                pretty_model.male_count = option(model.male_count, 0);
                pretty_model.unknown_count = option(model.unknown_count, 0);
                pretty_model.note = option(note, '', (x: any) => x.dataValues.text);
                pretty_model.pairing_date = option_date(model.pairing_date);
                pretty_model.plug_date = option_date(model.plug_date);
                pretty_model.pup_check_date = option_date(model.pup_check_date);


                return pretty_model;
            });
    }
    all_pretty() {
        const self = this;
        return super.all()
            .then((items: Breed_Instance[]) => BlueBird.map(items, (item: Breed_Instance) => self.pretty(item)))
            .then((model_array: Pretty_Breed[]) => model_array.filter((model: Pretty_Breed) => !isFalsey(model)));
    }
    by_id_alias(_id_alias: string) {
        const self = this;
        return this.get_where({ id_alias: _id_alias })
            .then((x: Breed_Instance[]) => self.pretty(x[0]));
    }

    insert(model_original: any) {
        // const self = this;
        const model = remove_empty(model_original, true);
        return Breed.create(model, {
            include: [
                { model: Breed, include: [Note] },
                { model: Breed, include: [Mouse], as: 'Male' },
                { model: Breed, include: [Mouse], as: 'Female' },
            ],
            returning: true,
        })
            .catch((err: any) => {
                console.log(err);
            });
    }

    update(model_original: any) {
        // const self = this;
        const tmp_model = remove_empty(model_original, true);
        return Breed.update(tmp_model, {
            where: { id: tmp_model.id },
            returning: true,
        })
            .then((updated_model) => {
                const model = updated_model[1][0];
                // const model = updated_model;
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
            .catch((err: any) => console.error(err));
    }
}

// module.exports = new Breed_Controller(Breed);
export const Breed_Controller = new Breed_Controller_Factory(Breed);
