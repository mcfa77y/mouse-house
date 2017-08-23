const BlueBird = require('bluebird')
const _ = require('underscore')
const isFalsey = require('falsey');

const Base_Controller = require('./base_controller')
const enum_controller = require('./enum_controller')
const cage_controller = require('./cage_controller')
const utils = require('./utils_controller')
const Mouse = require('../database/models').Mouse


class Controller extends Base_Controller {
    inputs() {
        return BlueBird.props({
                sex: mouse.getSex(),
                genotype: mouse.getGenotype(),
                status: mouse.getStatus(),
                cage: mouse.getCage(),
                note: mouse.getNote(),
            })
    }

    by_sex(sex) {
        return enum_controller.by_type_desc('SEX', sex)
            .then((sex_enum) => {
                return super.get_where({
                    sex_id: sex_enum.id
                })
            })
    }

    pretty(mouse) {
        return BlueBird.props({
                sex: enum_controller.get(mouse.sex_id),
                genotype: enum_controller.get(mouse.genotype_id),
                status: enum_controller.get(mouse.status_id),
                cage: mouse.getCage(),
                note: mouse.getNote(),
            })
            .then(({
                sex,
                genotype,
                status,
                cage, note
            }) => {
                let pretty_mouse = {}
                pretty_mouse.id = mouse.id
                pretty_mouse.id_alias = mouse.id_alias
                pretty_mouse.ear_tag = mouse.ear_tag
                pretty_mouse.notes = isFalsey(note) ? '' : note.text
                pretty_mouse.sex = isFalsey(sex) ? '' : sex.description
                pretty_mouse.genotype = isFalsey(genotype) ? '' : genotype.description
                pretty_mouse.status = isFalsey(status) ? '' : status.description
                pretty_mouse.sex_id = mouse.sex_id
                pretty_mouse.genotype_id = mouse.genotype_id
                pretty_mouse.status_id = mouse.status_id
                pretty_mouse.dob = utils.format_time(mouse.dob)
                pretty_mouse.age = utils.relative_time(mouse.dob)
                pretty_mouse.create_at = utils.format_time(mouse.create_at)
                pretty_mouse.modify_at = utils.format_time(mouse.modify_at)

                pretty_mouse.cage = isFalsey(cage) ? '' : cage.name
                pretty_mouse.cage_id = isFalsey(cage) ? '' : cage.id
                return pretty_mouse
            })
    }
    all_pretty() {
        const self = this
        return this.all()
            .then((items) => {
                return BlueBird.map(items, (item) => {
                    return self.pretty(item)
                })
            })
            .then((mouse_array) => {
                return mouse_array

            })

    }
    by_id_alias(_id_alias) {
        const self = this;
        return this.get_where({
                id_alias: _id_alias
            })
            .then((mice) => {
                return self.pretty(mice[0])
            })
    }

    delete_by_id_alias(_id_alias) {
        return this.delete_where({
            id_alias: _id_alias
        })
    }

    insert(_model) {
        _model = utils.remove_empty(_model, true)
        Mouse.create(_model, {
            include: [{
                association: Mouse.Note
            }],
            returning: true
        })
        .then(model => {
            return model.update({id_alias: model.id})
        })
        .catch(error => {
            console.log(error)
        })
    }

    update(_model) {
         _model = utils.remove_empty(_model)
        Mouse.update(_model, {
            where:{
                id: _model.id
            },
            returning: true
        })
        .then(updated_model => {
            const model = updated_model[1][0]
                return BlueBird.props({
                    note: model.getNote(),
                    model
                })
        })
        .then( ({note, model}) => {
            isFalsey(note) ? model.createNote(_model.note) : note.update(_model.note)
        })
    }
}

module.exports = new Controller(Mouse)