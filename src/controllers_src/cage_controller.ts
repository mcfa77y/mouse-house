import { Cage_Instance } from "../database/models/Cage";

import BlueBird from 'bluebird';
const isFalsey = require('falsey');

const {
    remove_empty, format_date, option, log_json
} = require('./utils_controller');
// const utils = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names;

import { Base_Controller } from './base_controller';

import { db } from '../database/models';
import { Mouse_Instance } from "../database/models/Mouse";
import { Note_Instance } from "../database/models/Note";
import { Enum_Instance } from "../database/models/Enum";

const { Cage, Note, Mouse } = db;

type Pretty_Cage = {
    id?: number;
    id_alias?: string;
    note?: string;
    type?: string;
    type_id?: number;
    end_date?: string;
    mice?: Mouse_Instance[];
    mouse_ids?: number[];
}

class Cage_Controller_Factory extends Base_Controller {
    pretty(model: Cage_Instance) {
        return BlueBird.props({
            type: model.getType(),
            mice: model.getMice(),
            note: model.getNote(),
        })
            .then(({ type, mice, note }) => {
                const pretty_model: Pretty_Cage = {};

                pretty_model.id = model.id;
                pretty_model.id_alias = model.id_alias;
                pretty_model.note = option(note.text, '', (note: Note_Instance) => note.text);
                pretty_model.type = option(type.description, '', (type: Enum_Instance) => type.description);
                pretty_model.type_id = option(type.description, -1, (type: Enum_Instance) => type.id);
                pretty_model.end_date = format_date(model.end_date);
                pretty_model.mice = mice;
                pretty_model.mouse_ids = option(mice, [], (mice: Mouse_Instance[]) => mice.map(m => m.id));
                return pretty_model;
            })
    }
    async all_pretty() {
        const self = this;
        return super.all().then((items: Cage_Instance[]) => BlueBird.map(items, (item: Cage_Instance) => self.pretty(item)))
            .then((model_array) => model_array);
    }
    async by_id_alias(_id_alias: string) {
        const self = this;
        this.Model.findAll({
            where: { id_alias: _id_alias }
        })
            .then((x: Cage_Instance[]) => self.pretty(x[0]))
            .catch((err: any) => log_json(err));

        return this.Model.find({ where: { id_alias: _id_alias } })

    }
    async insert(model: any): BlueBird<Cage_Instance> {
        // const self = this;
        const _model = remove_empty(model, true);
        // if(isFalsey(_model.name)){
        //     _model.name = city_names[Math.floor(Math.random() * city_names.length)]
        // }
        return Cage.create(_model, {
            include: [{ model: Cage, include: [Note] }],
            returning: true,
        })
            .then((nu_model) => {
                if (isFalsey(_model.id_alias)) {
                    nu_model.update({ id_alias: 'c-' + nu_model.id });
                }
                if (!isFalsey(_model.mouse_ids)) {
                    Mouse.update({ cage: nu_model }, { where: { id: { $in: _model.mouse_ids } } });
                }
                return nu_model;
            })
    }
    async update(model: any): BlueBird<Cage_Instance> {
        // const self = this;
        const _model = remove_empty(model, true);
        const foo = (updated_cage: [number, Cage_Instance[]]) => {
            const model = updated_cage[1][0];
            return BlueBird.props({
                mice: model.getMice(),
                note: model.getNote(),
                cage: model,
            });
        }

        return Cage.update(_model, {
            where: { id: _model.id },
            returning: true,
        })
            .then((updated_cage) => {
                const model = updated_cage[1][0];
                return BlueBird.props({
                    mice: model.getMice(),
                    note: model.getNote(),
                    cage: model,
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
                    mice.filter(mouse => !_model.mouse_ids.includes(`${mouse.id}`)).forEach((mouse) => {
                        mouse.update({ cage_id: null });
                    });
                }

                // add new mouse-cage connections
                Mouse.update({ cage: cage }, { where: { id: { $in: _model.mouse_ids } } });
                return cage;
            });
    }

}
export const Cage_Controller = new Cage_Controller_Factory(Cage);
