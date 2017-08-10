const BlueBird = require('bluebird')
const _ = require('underscore')
const isFalsey = require('falsey');

const Base_Controller = require('./base_controller')
const enum_controller = require('./enum_controller')
const cage_controller = require('./cage_controller')
const utils = require('./utils_controller')
const Mouse = require('../database/models').Mouse


class Controller extends Base_Controller {
    by_sex(sex) {
        return enum_controller.by_code_desc('SEX', sex)
            .then((sex_enum) => {
                return super.get_where({sex_id: sex_enum.id})
            })
    }

    pretty(mouse) {
        return BlueBird.props({
                sex: enum_controller.get(mouse.sex_id),
                genotype: enum_controller.get(mouse.genotype_id),
                status: enum_controller.get(mouse.status_id),
                cage: cage_controller.get(mouse.cage_id)
            })
            .then(({ sex, genotype, status, cage }) => {
                let pretty_mouse = {}
                pretty_mouse.id = mouse.id
                pretty_mouse.id_alias = mouse.id_alias
                pretty_mouse.ear_tag = mouse.ear_tag
                pretty_mouse.notes = mouse.notes
                pretty_mouse.sex = isFalsey(sex) ? '' : sex.description
                pretty_mouse.genotype = isFalsey(genotype) ? '' : genotype.description
                pretty_mouse.status = isFalsey(status) ? '' : status.description
                pretty_mouse.sex_id = mouse.sex_id
                pretty_mouse.genotype_id = mouse.genotype_id
                pretty_mouse.status_id = mouse.status_id
                pretty_mouse.dob = utils.format_time(mouse.dob)
                pretty_mouse.create_at = utils.format_time(mouse.create_at)
                pretty_mouse.modify_at = utils.format_time(mouse.modify_at)

                pretty_mouse.cage = isFalsey(cage) ? '' : cage.name
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
    by_id_alias(_id_alias){
        const self = this;
        return this.get_where({id_alias: _id_alias})
            .then((mice) => {
                return self.pretty(mice[0])
            })
    }

    delete_by_id_alias(_id_alias){
        return this.delete_where({id_alias: _id_alias})
    }
}

module.exports = new Controller(Mouse)
