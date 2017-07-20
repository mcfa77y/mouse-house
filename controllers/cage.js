const BlueBird = require('bluebird')
const {
    Base_Controller,
    db,
    squel
} = require('./base_controller')
const enum_type_controller = require('./enum_type')
const enum_controller = require('./enum')
const utils = require('./utils_controller')
const city_names = require('../lib/data/city_names.json').city_names


class Controller extends Base_Controller {
    pretty(model) {
        return BlueBird.props({
                type: enum_controller.by_id(model.type_id),
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
        return this.all().then((items) => {
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
        const query = squel.select()
            .from(this.name)
            .where('id_alias = ?', _id_alias)
            .toString()
        return db.one(query).then((x)=>{return self.pretty(x)})
    }
    insert(model){
        // remove empty params
        model = utils.remove_empty(model, true)
        // do related things
        if(model.mouse_ids){
            console.log('add mouse to cage' + model.mouse_ids)
        }
        delete model.mouse_ids
        model.name = city_names[Math.floor(Math.random() * city_names.length)]

        return super.insert(model)
    }
    update(model){
        // do related things
        if(model.mouse_ids){
            console.log('add mouse to cage' + model.mouse_ids)
        }
        delete model.mouse_ids


        return super.update(model)
    }
}

module.exports = new Controller('cage')
