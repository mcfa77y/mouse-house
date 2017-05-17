const {Base_Controller, db, squel} = require('./base_controller')
const enum_type_controller = require('./enum_type')
const enum_controller = require('./enum')
const mouse_model = require('../model/mouse')

class Controller extends Base_Controller {
    getMiceBySexForSelect(sex) {
        return enum_controller.getByEnumTypeCodeAndDesc('SEX', sex)
            .then((result) => {
                const query = squel.select()
                    .field('id')
                    .field('id', 'description')
                    .from(this.name)
                    .where('sex_id = ?', result.id)
                    .toString()
                console.log('male: ' + query)
                return db.any(query)
            })
    }

    prettyPrintMouse(mouse) {
        return BlueBird.props({
                sex: enum_controller.getByIdMemo(mouse.sex_id),
                genotype: enum_controller.getByIdMemo(mouse.genotype_id),
                status: enum_controller.getByIdMemo(mouse.status_id)
            })
            .then(({sex, genotype, status}) => {
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
    getAllPretty() {
        let self = this
        return this.getAll().then((items) => {
                return BlueBird.map(items, (item) => {
                    return self.pretty_mouse(item)
                })
            })
            .then((mouse_array) => {
                return {
                    data: mouse_array
                }
            })

    }
}

module.exports = new Controller('mouse')
