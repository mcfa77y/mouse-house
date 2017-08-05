const BlueBird = require('bluebird')

const utils = require('./utils_controller')
const city_names = require('../lib/data/city_names.json').city_names


const new_enum_controller = require('./new_enum')
const models = require('../database/models')
const Cage = models.Cage

class Controller {
    create(_cage) {
        return Cage.create(_cage)
          
          
    }
    pretty(model) {
        return BlueBird.props({
                type: new_enum_controller.get(model.type_id),
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
        return Cage.findAll().then((items) => {
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
        return Cage.findOne({where: {id_alias: _id_alias}})
            .then(x => {return self.pretty(x)})
    }

    insert(model){
        model.name = city_names[Math.floor(Math.random() * city_names.length)]
        return Cage.create(model)
            .then(() => {
                // link mouse up with cage
                if (model.mouse_ids) {
                    console.log('add mouse to cage' + model.mouse_ids)
                }
            })
    }
    update(model){
        // do related things
        if(model.mouse_ids){
            console.log('add mouse to cage' + model.mouse_ids)
        }
        delete model.mouse_ids

        return Cage.update(model, {where: {id: model.id}})
    }
}

module.exports = new Controller()
