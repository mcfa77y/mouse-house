const BlueBird = require('bluebird')

const utils = require('./utils_controller')
const city_names = require('../lib/data/city_names.json').city_names

const Base_Controller = require('./base_controller')
const enum_controller = require('./enum_controller')
const Cage = require('../database/models').Cage

class Controller extends Base_Controller{
    pretty(model) {
        return BlueBird.props({
                type: enum_controller.get(model.type_id),
            })
            .then(({ type }) => {
                model.type = type.description
                model.setup_date = utils.format_time(model.setup_date)
                model.update_date = utils.format_time(model.update_date)
                model.end_date = utils.format_time(model.end_date)
                return model
            })
    }
    all_pretty() {
        let self = this
        return super.all().then((items) => {
                return BlueBird.map(items, (item) => {
                    return self.pretty(item)
                })
            })
            .then((model_array) => {
                return model_array
            })

    }
    by_id_alias(_id_alias){
        let self = this
        return this.get_where({id_alias: _id_alias})
            .then(x => {return self.pretty(x)})
    }

    insert(_model){
        _model.name = city_names[Math.floor(Math.random() * city_names.length)]
        return super.insert(_model)
            .then(() => {
                // link mouse up with cage
                if (model.mouse_ids) {
                    console.log('add mouse to cage' + model.mouse_ids)
                }
            })
    }
    update(_model){
        // do related things
        if(_model.mouse_ids){
            console.log('add mouse to cage' + _model.mouse_ids)
            delete _model.mouse_ids
        }

        return super.update(_model)
    }
}

module.exports = new Controller(Cage)
