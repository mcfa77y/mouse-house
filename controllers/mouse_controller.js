const BlueBird = require('bluebird');
// const _ = require('underscore')
const isFalsey = require('falsey');

const Base_Controller = require('./base_controller');
const enum_controller = require('./enum_controller');
// const cage_controller = require('./cage_controller')
const utils = require('./utils_controller');
const Mouse = require('../database/models').Mouse;


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
            .then(sex_enum => super.get_where({
                sex_id: sex_enum.id,
            }));
    }

    pretty(mouse) {
        const self = this;
        return BlueBird.props({
            sex: enum_controller.get(mouse.sex_id),
            genotype: enum_controller.get(mouse.genotype_id),
            status: enum_controller.get(mouse.status_id),
            cage: mouse.getCage({ attributes: ['id', 'name', 'id_alias'] }),
            note: mouse.getNote({ attributes: ['id', 'text'] }),
            breeds: mouse.getBreeds({ attributes: ['id'] }),
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
                pretty_mouse.breeds = isFalsey(breeds) ? [] : breeds.map(breed => `${breed.id}`);
                pretty_mouse.cage = isFalsey(cage) ? '' : cage.name;
                pretty_mouse.cage_id = isFalsey(cage) ? '' : `${cage.id}`;
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
            .then(model => model.update({ id_alias: model.id }))
            .catch((error) => {
                console.log(error);
            });
    }

    update(_model) {
        const self = this;
        const _model = utils.remove_empty(_model);
        return Mouse.update(_model, {
            where: {
                id: _model.id,
            },
            returning: true,
        })
            .then((updated_model) => {
                const model = updated_model[1][0];
                return BlueBird.props({
                    note: model.getNote(),
                    status: model.getStatus(),
                    genotype: model.getGenotype(),
                    cage: model.getCage(),
                    model,
                });
            })
            .then(({
                note, status, genotype, cage, model,
            }) => {
                if (!isFalsey(_model.note)) {
                    isFalsey(note) ? model.createNote(_model.note) : note.update(_model.note);
                }
                if (!isFalsey(_model.status)) {
                    isFalsey(status) ? model.createStatus(_model.status) : status.update(_model.status);
                }
                if (!isFalsey(_model.genotype)) {
                    isFalsey(genotype) ? model.createGenotype(_model.genotype) : genotype.update(_model.genotype);
                }
                if (!isFalsey(_model.cage)) {
                    isFalsey(cage) ? model.createCage(_model.cage) : cage.update(_model.cage);
                }
            });
    }
}

module.exports = new Mouse_Controller(Mouse);
