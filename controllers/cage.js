const BlueBird = require('bluebird')
const {
    Base_Controller,
    db,
    squel
} = require('./base_controller')
const enum_type_controller = require('./enum_type')
const enum_controller = require('./enum')
const utils = require('./utils_controller')

class Controller extends Base_Controller {
    pretty(model) {
        return BlueBird.props({
                type: enum_controller.getById(model.type_id),
            })
            .then(({ type }) => {
                model.type = type.description
                // convert to relative time
                model.setup_date = utils.stringTime(model.setup_date)
                model.update_date = utils.stringTime(model.update_date)
                model.end_date = utils.stringTime(model.end_date)
                return model
            })
    }
    all_pretty() {
        let self = this
        return this.all().then((items) => {
                return BlueBird.map(items, (item) => {
                    return self.pretty(item)
                })
            })
            .then((model_array) => {
                return model_array

            })

    }
    insert(model){
        // remove empty params
        model = utils.removeEmpty(model, true)
        // do related things
        if(model.mouse_ids){
            console.log('add mouse to cage' + model.mouse_ids)
        }
        delete model.mouse_ids


        return super.insert(model)
    }
}

module.exports = new Controller('cage')
