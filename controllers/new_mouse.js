const BlueBird = require('bluebird')
const { Base_Controller, db, squel } = require('./base_controller')
const new_enum_controller = require('./enum')
const utils = require('./utils_controller')
const Mouse = require('../database/models').Mouse
const _ = require('underscore')
const New_Base_Controller = require('./new_base_controller')

class Controller extends New_Base_Controller {
    by_sex(sex) {
        return new_enum_controller.by_code_desc('SEX', sex)
    }

    pretty(mouse) {
        return BlueBird.props({
                sex: new_enum_controller.get(mouse.sex_id),
                genotype: new_enum_controller.get(mouse.genotype_id),
                status: new_enum_controller.get(mouse.status_id),
            })
            .then(({ sex, genotype, status }) => {
                mouse.sex = sex.description
                mouse.genotype = genotype.description
                mouse.status = status.description
                mouse.dob = utils.format_time(mouse.dob)
                mouse.create_timestamp = utils.format_time(mouse.create_timestamp)
                mouse.modify_timestamp = utils.format_time(mouse.modify_timestamp)
                return mouse
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
