import BlueBird from 'bluebird';
// const _ = require('underscore')
const isFalsey = require('falsey');

import { Base_Controller } from './base_controller';
import { Enum_Controller } from './Enum_Controller';
// const cage_controller = require('./cage_controller')
import { format_date, relative_time, remove_empty } from './utils_controller';
import { db } from '../database/models';
import { Mouse_Instance } from '../database/models/Mouse';
import { Enum_Instance } from '../database/models/Enum';
import { Cage_Instance } from '../database/models/Cage';
import { Breed_Instance } from '../database/models/Breed';
import { Note_Instance } from '../database/models/Note';
// import { DbInterface } from '../typings/DbInterface';
const { Mouse, Note, Cage, Enum } = db;

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
    breeds?: string[];
    cage?: string;
    cage_id?: number;
    cage_id_alias?: string;
}

class Mouse_Controller_Factory extends Base_Controller {
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
        return Enum_Controller.by_type_desc('SEX', sex)
            .then((sex_enum: Enum_Instance) => super.get_where({
                sex_id: sex_enum.id,
            }));
    }

    pretty(mouse: Mouse_Instance) {
        // const self = this;
        return BlueBird.props({
            sex: mouse.getSex(),
            genotype: mouse.getGenotype(),
            status: mouse.getStatus(),
            cage: mouse.getCage(),
            note: mouse.getNote(),
            breeds: mouse.getBreeds(),
        })
            .then(({sex, genotype, status, cage, note, breeds}) => {
                const pretty_mouse: Pretty_Mouse = {};
                pretty_mouse.id = mouse.id;
                pretty_mouse.id_alias = mouse.id_alias;
                pretty_mouse.ear_tag = mouse.ear_tag;
                pretty_mouse.notes = isFalsey(note) ? '' : note.text;
                pretty_mouse.sex = isFalsey(sex) ? '' : sex.description;
                pretty_mouse.genotype = isFalsey(genotype) ? '' : genotype.description;
                pretty_mouse.status = isFalsey(status) ? '' : status.description;
                // pretty_mouse.sex_id = mouse.sex;
                pretty_mouse.genotype_id = genotype.id;
                pretty_mouse.status_id = status.id;
                pretty_mouse.dob = format_date(mouse.dob);
                pretty_mouse.age = relative_time(mouse.dob);
                pretty_mouse.create_at = format_date(mouse.created_at);
                pretty_mouse.modify_at = format_date(mouse.updated_at);
                pretty_mouse.breeds = isFalsey(breeds) ? [] : breeds.map(breed => `${breed.id_alias}`);
                pretty_mouse.cage_id = isFalsey(cage) ? -1 : cage.id;
                pretty_mouse.cage_id_alias = isFalsey(cage) ? '' : cage.id_alias;
                return pretty_mouse;
            });
    }
    all_pretty() {
        const self = this;
        return this.all()
            .then((items: Mouse_Instance[]) => BlueBird.map(items, (item: Mouse_Instance) => self.pretty(item)))
            .then((mouse_array: Pretty_Mouse) => mouse_array);
    }
    some_pretty(limit: number, offset = 0) {
        const self = this;
        return Mouse.findAll({ limit, offset })
            .then((items: Mouse_Instance[]) => BlueBird.map(items, (item: Mouse_Instance) => self.pretty(item)))
            .then((mouse_array: Pretty_Mouse[]) => mouse_array);
    }
    by_id_alias(_id_alias: string) {
        const self = this;
        return this.get_where({
            id_alias: _id_alias,
        })
            .then((items: Mouse_Instance[]) => self.pretty(items[0]));
    }

    delete_by_id_alias(_id_alias: string) {
        return this.delete_where({
            id_alias: _id_alias,
        });
    }

    insert(_model: any) {
        // const self = this;
        const tmp_model = remove_empty(_model, true);
        return Mouse.create(tmp_model, {
            include: [
                { model: Mouse, include: [Note], },
                { model: Mouse, include: [Enum], as: 'Sex' },
                { model: Mouse, include: [Enum], as: 'Genotype' },
                { model: Mouse, include: [Enum], as: 'Status' },
                { model: Mouse, include: [Cage]},
            ],
            returning: true,
        })
            .then(async (model: Mouse_Instance) => {
                const sex= await model.getSex();
                Enum_Controller.Model

                const sex_abreviation = await Enum_Controller
                    .get(sex.id)
                    .then((x: Enum_Instance) => x.description[0]);
                const new_alias = `m${sex_abreviation}-${model.id}`;
                model.update({ id_alias: new_alias });
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

    update(model: any) {
        const self = this;
        return Mouse.update(remove_empty(model), {
            where: {
                id: model.id,
            },
            returning: true,
        })
        // .then((updated_model: Mouse_Instance[]) => {
        //     const nu_model = updated_model[1];
        //     return BlueBird.props({
        //         note: nu_model.getNote(),
        //         status: nu_model.getStatus(),
        //         genotype: nu_model.getGenotype(),
        //         cage: nu_model.getCage(),
        //         nu_model,
        //     });
        // })
        // .then(( {note}: {note: Note_Instance},
        //     {status}: {status: Enum_Instance},
        //     {genotype}: {genotype: Enum_Instance},
        //     {cage}: {cage: Cage_Instance},
        //     {nu_model}: {nu_model: Mouse_Instance}) => {
        //     if (!isFalsey(nu_model.note)) {
        //         isFalsey(note) ? nu_model.createNote(note) : note.update(nu_model.note);
        //     }
        //     if (!isFalsey(nu_model.status)) {
        //         isFalsey(status) ? nu_model.createStatus(nu_model.status) : status.update(nu_model.status);
        //     }
        //     if (!isFalsey(nu_model.genotype)) {
        //         isFalsey(genotype) ? nu_model.createGenotype(nu_model.genotype) : genotype.update(nu_model.genotype);
        //     }
        //     if (!isFalsey(nu_model.cage)) {
        //         isFalsey(cage) ? nu_model.createCage(nu_model.cage) : cage.update(nu_model.cage);
        //     }
        // });
    }
}

export const Mouse_Controller = new Mouse_Controller_Factory(Mouse);
