const BlueBird = require('bluebird')
const { Base_Controller, db, squel } = require('./base_controller')
const enum_type_controller = require('./enum_type')
const enum_controller = require('./enum')
const utils = require('./utils_controller')
const mouse_model = require('../model/mouse')

class Controller extends Base_Controller {
    by_sex(sex) {
        return enum_controller.by_codeAndDesc('SEX', sex)
            .then((sex_enum) => {
                const query = squel.select()
                    .field('id')
                    .field('id', 'description')
                    .from(this.name)
                    .where('sex_id = ?', sex_enum.id)
                    .toString()
                console.log('get by sex: ' + query)
                return db.any(query)
            })
    }

    pretty(mouse) {
        return BlueBird.props({
                sex: enum_controller.getById(mouse.sex_id),
                genotype: enum_controller.getById(mouse.genotype_id),
                status: enum_controller.getById(mouse.status_id)
            })
            .then(({ sex, genotype, status }) => {
                mouse.sex = sex.description
                mouse.genotype = genotype.description
                mouse.status = status.description
                    // convert to relative time
                mouse.dob = utils.relativeTime(mouse.dob)
                mouse.create_timestamp = utils.relativeTime(mouse.create_timestamp)
                mouse.modify_timestamp = utils.relativeTime(mouse.modify_timestamp)
                return mouse
            })
    }
    all_pretty() {
        let self = this
        return this.all().then((items) => {
                return BlueBird.map(items, (item) => {
                    return self.pretty(item)
                })
            })
            .then((mouse_array) => {
                return mouse_array

            })

    }
    insert(model){
        //
        if(model.cage_id){
            console.log('add mouse to cage')
        }
        delete model.cage_id
        return super.insert(model)
    }
}

module.exports = new Controller('mouse')
