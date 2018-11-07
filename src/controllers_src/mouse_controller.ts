import { BlueBird } from 'bluebird';
// const _ = require('underscore')
import { isFalsey } from 'falsey';

import { Base_Controller } from './base_controller';
import { enum_controller } from './enum_controller';
// const cage_controller = require('./cage_controller')
import { format_date, relative_time, remove_empty } from './utils_controller';
import { db } from '../database/models';
import { Mouse_Instance } from '../database/models/mouse';
import { Enum_Instance } from '../database/models/enum';
import { Cage_Instance } from '../database/models/cage';
import { Breed_Instance } from '../database/models/breed';
import { Note_Instance } from '../database/models/note';

const { Mouse } = db;

type Pretty_Mouse = {
    id?: number;
    id_alias?: string;
    ear_tag?: string;
    notes?: string;
    sex?: string;
    genotype?: string;
    status?: string;
    sex_id?: number;
    genotype_id?: number;
    status_id?: number;
    dob?: string;
    age?: string;
    create_at?: string;
    modify_at?: string;
    breeds?: string;
    cage?: string;
    cage_id?: number;
    cage_id_alias?: string;
}
class Mouse_Controller extends Base_Controller {
    get STATUS() {
        return 'MOUSE_STATUS';
    }
    get GENOTYPE() {
        return 'MOUSE_GENOTYPE';
    }
    get SEX() {
        return 'SEX';
    }

    by_sex(sex: string) {
        return enum_controller.by_type_desc('SEX', sex)
            .then(sex_enum => super.get_where({
                sex_id: sex_enum.id,
            }));
    }

    pretty(mouse: Mouse_Instance) {
        const self = this;
        return BlueBird.props({
            sex: mouse.sex,
            genotype: enum_controller.get(mouse.genotype),
            status: enum_controller.get(mouse.status),
            cage: mouse.getCage({ attributes: ['id', 'id_alias'] }),
            note: mouse.getNote({ attributes: ['id', 'text'] }),
            breeds: mouse.getBreeds({ attributes: ['id_alias'] }),
        })
            .then(({ sex }: { sex: string },
                { genotype }: { genotype: Enum_Instance },
                { status }: { status: Enum_Instance },
                { cage }: { cage: Cage_Instance },
                { note }: { note: Note_Instance },
                { breeds }: { breeds: Breed_Instance[] }
            ) => {
                const pretty_mouse: Pretty_Mouse = {};
                pretty_mouse.id = mouse.id;
                pretty_mouse.id_alias = mouse.id_alias;
                pretty_mouse.ear_tag = mouse.ear_tag;
                pretty_mouse.notes = isFalsey(note) ? '' : note.text;
                pretty_mouse.sex = isFalsey(sex) ? '' : sex;
                pretty_mouse.genotype = isFalsey(genotype) ? '' : genotype.description;
                pretty_mouse.status = isFalsey(status) ? '' : status.description;
                // pretty_mouse.sex_id = mouse.sex;
                pretty_mouse.genotype_id = genotype.id;
                pretty_mouse.status_id = mouse.status_id;
                pretty_mouse.dob = format_date(mouse.dob);
                pretty_mouse.age = relative_time(mouse.dob);
                pretty_mouse.create_at = format_date(mouse.create_at);
                pretty_mouse.modify_at = format_date(mouse.modify_at);
                pretty_mouse.breeds = isFalsey(breeds) ? [] : breeds.map(breed => `${breed.id_alias}`);
                pretty_mouse.cage = isFalsey(cage) ? '' : cage.name;
                pretty_mouse.cage_id = isFalsey(cage) ? '' : cage.id;
                pretty_mouse.cage_id_alias = isFalsey(cage) ? '' : cage.id_alias;
                return pretty_mouse;
            });
    }
    all_pretty() {
        const self = this;
        return this.all()
            .then(items => BlueBird.map(items, item => self.pretty(item)))
            .then(mouse_array => mouse_array);
    }
    some_pretty(limit, offset = 0) {
        const self = this;
        return Mouse.findAll({ limit, offset })
            .then(items => BlueBird.map(items, item => self.pretty(item)))
            .then(mouse_array => mouse_array);
    }
    by_id_alias(_id_alias) {
        const self = this;
        return this.get_where({
            id_alias: _id_alias,
        })
            .then(mice => self.pretty(mice[0]));
    }

    delete_by_id_alias(_id_alias) {
        return this.delete_where({
            id_alias: _id_alias,
        });
    }

    insert(_model) {
        const self = this;
        const tmp_model = remove_empty(_model, true);
        return Mouse.create(tmp_model, {
            include: [
                { association: Mouse.Note },
                { association: Mouse.Sex },
                { association: Mouse.Genotype },
                { association: Mouse.Status },
                { association: Mouse.Cage },
            ],
            returning: true,
        })
            .then(async (model) => {
                const sex_abreviation = await enum_controller
                    .get(model.sex_id)
                    .then(x => x.description[0]);
                const new_alias = `m${sex_abreviation}-${model.id}`;
                model.update({ id_alias: new_alias });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    update(model) {
        const self = this;
        return Mouse.update(remove_empty(model), {
            where: {
                id: model.id,
            },
            returning: true,
        })
            .then((updated_model) => {
                const nu_model = updated_model[1][0];
                return BlueBird.props({
                    note: nu_model.getNote(),
                    status: nu_model.getStatus(),
                    genotype: nu_model.getGenotype(),
                    cage: nu_model.getCage(),
                    nu_model,
                });
            })
            .then(({
                note, status, genotype, cage, nu_model,
            }) => {
                if (!isFalsey(nu_model.note)) {
                    isFalsey(note) ? nu_model.createNote(nu_model.note) : note.update(nu_model.note);
                }
                if (!isFalsey(nu_model.status)) {
                    isFalsey(status) ? nu_model.createStatus(nu_model.status) : status.update(nu_model.status);
                }
                if (!isFalsey(nu_model.genotype)) {
                    isFalsey(genotype) ? nu_model.createGenotype(nu_model.genotype) : genotype.update(nu_model.genotype);
                }
                if (!isFalsey(nu_model.cage)) {
                    isFalsey(cage) ? nu_model.createCage(nu_model.cage) : cage.update(nu_model.cage);
                }
            });
    }
}

module.exports = new Mouse_Controller(Mouse);
