const BlueBird = require('bluebird');
// const _ = require('underscore')
const {falsy: isFalsey} = require('is_js');

const Base_Controller = require('./base_controller');
const enum_controller = require('./enum_controller');
// const cage_controller = require('./cage_controller')
const utils = require('./utils_controller');
const { Mouse } = require('../database/models');


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

    by_sex(sex) {
        return enum_controller.by_type_desc('SEX', sex)
            .then((sex_enum) => super.get_where({
                sex_id: sex_enum.id,
            }));
    }

    pretty(mouse) {
        const self = this;
        return BlueBird.props({
            sex: enum_controller.get(mouse.sex_id),
            genotype: enum_controller.get(mouse.genotype_id),
            status: enum_controller.get(mouse.status_id),
            cage: mouse.getCage({ attributes: ['id', 'id_alias'] }),
            note: mouse.getNote({ attributes: ['id', 'text'] }),
            breeds: mouse.getBreeds({ attributes: ['id_alias'] }),
        })
            .then(({
                sex,
                genotype,
                status,
                cage,
                note,
                breeds,
            }) => {
                const pretty_mouse = {};
                pretty_mouse.id = mouse.id;
                pretty_mouse.id_alias = mouse.id_alias;
                pretty_mouse.ear_tag = mouse.ear_tag;
                pretty_mouse.notes = isFalsey(note) ? '' : note.text;
                pretty_mouse.sex = isFalsey(sex) ? '' : sex.description;
                pretty_mouse.genotype = isFalsey(genotype) ? '' : genotype.description;
                pretty_mouse.status = isFalsey(status) ? '' : status.description;
                pretty_mouse.sex_id = `${mouse.sex_id}`;
                pretty_mouse.genotype_id = `${mouse.genotype_id}`;
                pretty_mouse.status_id = `${mouse.status_id}`;
                pretty_mouse.dob = utils.format_date(mouse.dob);
                pretty_mouse.age = utils.relative_time(mouse.dob);
                pretty_mouse.create_at = utils.format_date(mouse.create_at);
                pretty_mouse.modify_at = utils.format_date(mouse.modify_at);
                pretty_mouse.breeds = isFalsey(breeds) ? [] : breeds.map((breed) => `${breed.id_alias}`);
                pretty_mouse.cage = isFalsey(cage) ? '' : cage.name;
                pretty_mouse.cage_id = isFalsey(cage) ? '' : `${cage.id}`;
                pretty_mouse.cage_id_alias = isFalsey(cage) ? '' : cage.id_alias;
                return pretty_mouse;
            });
    }

    all_pretty() {
        const self = this;
        return this.all()
            .then((items) => BlueBird.map(items, (item) => self.pretty(item)))
            .then((mouse_array) => mouse_array);
    }

    some_pretty(limit, offset = 0) {
        const self = this;
        return Mouse.findAll({ limit, offset })
            .then((items) => BlueBird.map(items, (item) => self.pretty(item)))
            .then((mouse_array) => mouse_array);
    }

    by_id_alias(_id_alias) {
        const self = this;
        return this.get_where({
            id_alias: _id_alias,
        })
            .then((mice) => self.pretty(mice[0]));
    }

    delete_by_id_alias(_id_alias) {
        return this.delete_where({
            id_alias: _id_alias,
        });
    }

    insert(_model) {
        const self = this;
        _model = utils.remove_empty(_model, true);
        return Mouse.create(_model, {
            include: [
                { association: Mouse.Note },
                { association: Mouse.Sex },
                { association: Mouse.Genotype },
                { association: Mouse.Status },
                { association: Mouse.Cage },
            ],
            returning: true,
        })
            .then((model) => model.update({ id_alias: model.id }))
            .catch((error) => {
                console.log(error);
            });
    }

    update(model) {
        const self = this;
        return Mouse.update(utils.remove_empty(model), {
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
