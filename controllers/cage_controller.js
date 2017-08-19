const BlueBird = require('bluebird')
const isFalsey = require('falsey')

const utils = require('./utils_controller')
const city_names = require('../lib/data/city_names.json').city_names

const Base_Controller = require('./base_controller')
const enum_controller = require('./enum_controller')
const Cage = require('../database/models').Cage
const Mouse = require('../database/models').Mouse

class Controller extends Base_Controller {
    pretty(model) {
        return BlueBird.props({
                type: model.getType(),
                mice: model.getMice(),
                note: model.getNote()
            })
            .then(({ type,mice, note }) => {
                let pretty_model = {}

                pretty_model.id = model.id
                pretty_model.id_alias = model.id_alias
                pretty_model.name = model.name
                if(!isFalsey(note)){
                    pretty_model.note = note.text
                }
                else{
                    pretty_model.note = ''
                }
                pretty_model.type = isFalsey(type) ? '' : type.description
                pretty_model.setup_date = utils.format_time(model.setup_date)
                pretty_model.update_date = utils.format_time(model.update_date)
                pretty_model.end_date = utils.format_time(model.end_date)
                pretty_model.mice = mice
                pretty_model.mouse_ids = mice.map(m=>m.id)
                return pretty_model
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
    by_id_alias(_id_alias) {
        let self = this
        return this.get_where({ id_alias: _id_alias })
            .then(x => { return self.pretty(x[0]) })
    }

    insert(_model) {
        _model = utils.remove_empty(_model, true)
        _model.name = city_names[Math.floor(Math.random() * city_names.length)]
        Cage.create(_model, {
                    include: [{ association: Cage.Notes }],
                    returning: true
            })
            .then(cage => {
                return Mouse.update({cage_id: cage.id},
                {
                    where: {
                        id: {
                            $in: _model.mouse_ids
                        }
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })


        // return super.insert(_model)
        //     .then(() => {
        //         // link mouse up with cage
        //         if (_model.mouse_ids) {
        //             console.log('add mouse to cage' + _model.mouse_ids)
        //         }
        //     })
    }
    update(_model) {
        // do related things
        _model = utils.remove_empty(_model, true)
        // if (_model.mouse_ids) {
        //     console.log('add mouse to cage' + _model.mouse_ids)
        //     delete _model.mouse_ids
        // }
        return Cage.update(_model, { where: {id: _model.id}, returning: true})
            .then(updated_cage => {
                 const model = updated_cage[1][0]
                 return BlueBird.props({
                        mice: model.getMice(),
                        note: model.getNote(),
                        cage: model
                })
            })
            .then(({ mice, note, cage }) =>{
                note.update(_model.note)

                mice.forEach(mouse => {
                        mouse.update({cage_id: null})
                })
                
                _model.mouse_ids.forEach(id => {
                    Mouse.update({cage_id: cage.id}, {where:{id: id}})
                })
            })
            
    }
}

module.exports = new Controller(Cage)