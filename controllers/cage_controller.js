const BlueBird = require('bluebird')
const isFalsey = require('falsey')

const utils = require('./utils_controller')
const city_names = require('../lib/data/city_names.json').city_names

const Base_Controller = require('./base_controller')
const Cage = require('../database/models').Cage
const Mouse = require('../database/models').Mouse

class Cage_Controller extends Base_Controller {
    pretty(model) {
        return BlueBird.props({
                type: model.getType(),
                mice: model.getMice(),
                note: model.getNote()
            })
            .then(({ type, mice, note }) => {
                let pretty_model = {}

                pretty_model.id = model.id
                pretty_model.id_alias = model.id_alias
                pretty_model.name = model.name
                pretty_model.note = isFalsey(note) ? '' : note.text
                pretty_model.type = isFalsey(type) ? '' : type.description
                pretty_model.type_id = isFalsey(type) ? '' : type.id
                pretty_model.setup_date = utils.format_time(model.setup_date)
                pretty_model.update_date = utils.format_time(model.update_date)
                pretty_model.end_date = utils.format_time(model.end_date)
                pretty_model.mice = mice
                pretty_model.mouse_ids = mice.map(m => m.id)
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
        return Cage.create(_model, {
                include: [{ association: Cage.Note }],
                returning: true
            })
            .then(model => {
                model.update({id_alias: model.id})
                if(!isFalsey(_model.mouse_ids)){
                    return Mouse.update({ cage_id: model.id }, { where: { id: { $in: _model.mouse_ids } } })
                }
                 
            })
            .catch(err => {
                console.log(err)
            })
    }
    update(_model) {
        _model = utils.remove_empty(_model, true)

        return Cage.update(_model, {
                where: { id: _model.id },
                include: [{ association: Cage.Notes }],
                returning: true
            })
            .then(updated_cage => {
                const model = updated_cage[1][0]
                return BlueBird.props({
                    mice: model.getMice(),
                    note: model.getNote(),
                    cage: model
                })
            })
            .then(({ mice, note, cage }) => {
                if (note == null) {

                    cage.createNote(_model.note)

                } else {
                    note.update(_model.note)
                }

                if (!isFalsey(mice)) {
                    // remove old mouse-cage connections
                    mice.filter(mouse =>{
                        return !_model.mouse_ids.includes(mouse.id+"")
                    }).forEach(mouse => {
                        mouse.update({ cage_id: null })
                    })
                }

                // add new mouse-cage connections
                Mouse.update({ cage_id: cage.id }, { where: { id: { $in: _model.mouse_ids } } })


            })

    }
}

module.exports = new Cage_Controller(Cage)