const BlueBird = require('bluebird')
const Base_Controller = require('./base_controller')
const enum_controller = require('./enum_controller')
const utils = require('./utils_controller')
const Mouse = require('../database/models').Mouse
const _ = require('underscore')


class Controller extends Base_Controller {
    by_sex(sex) {
        return enum_controller.by_code_desc('SEX', sex)
    }

    pretty(mouse) {
        return BlueBird.props({
                sex: enum_controller.get(mouse.sex_id),
                genotype: enum_controller.get(mouse.genotype_id),
                status: enum_controller.get(mouse.status_id),
            })
            .then(({ sex, genotype, status }) => {
                let pretty_mouse = {}
                pretty_mouse.id = mouse.id
                pretty_mouse.id_alias = mouse.id_alias
                pretty_mouse.ear_tag = mouse.ear_tag
                pretty_mouse.notes = mouse.notes
                pretty_mouse.sex = sex.description
                pretty_mouse.genotype = genotype.description
                pretty_mouse.status = status.description
                pretty_mouse.dob = utils.format_time(mouse.dob)
                pretty_mouse.create_at =     utils.format_time(mouse.create_at)
                pretty_mouse.modify_at = utils.format_time(mouse.modify_at)
                return pretty_mouse
            })
    }
    all_pretty() {
        let self = this
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
        return this.get_where({id_alias: _id_alias})
    }

    delete_by_id_alias(_id_alias){
        return this.delete_where({id_alias: _id_alias})
    }
}

module.exports = new Controller(Mouse)
