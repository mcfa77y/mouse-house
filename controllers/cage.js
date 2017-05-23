const {
    Base_Controller,
    db,
    squel
} = require('./base_controller')
const enum_type_controller = require('./enum_type')
const enum_controller = require('./enum')
const utils = require('./utils_controller')

class Controller extends Base_Controller {
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
