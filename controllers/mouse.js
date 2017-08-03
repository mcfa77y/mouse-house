const BlueBird = require('bluebird')
const { Base_Controller, db, squel } = require('./base_controller')
const enum_type_controller = require('./enum_type')
const enum_controller = require('./enum')
const utils = require('./utils_controller')
const models = require('../database/models')
const _ = require('underscore')
const cage_mouse_controller = new Base_Controller('cage_mouse')

class Controller extends Base_Controller {
    by_sex(sex) {
        return enum_controller.by_code_desc('SEX', sex)
            .then((sex_enum) => {
                const query = squel.select()
                    .field('id', 'description')
                    .from(this.name)
                    .where('sex_id = ?', sex_enum.id)
                    .toString()
                return db.any(query)
            })
    }

    pretty(mouse) {
        return BlueBird.props({
                sex: enum_controller.get(mouse.sex_id),
                genotype: enum_controller.get(mouse.genotype_id),
                status: enum_controller.get(mouse.status_id),
                cage: cage_mouse_controller.get(mouse.id)
            })
            .then(({ sex, genotype, status, cage }) => {
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
        return this.all().then((items) => {
                return BlueBird.map(items, (item) => {
                    return self.pretty(item)
                })
            })
            .then((mouse_array) => {
                return mouse_array

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
        if(model.cage_id){
            console.log('add mouse to cage')
            cage_mouse_controller
                .insert({cage_id: model.cage_id, mouse_id: model.id})
                .catch( (error) => {
                    utils.log_json(error)
                })
            delete model.cage_id
    
        }

        return super.insert(model)
    }

    delete_by_id_alias(_id_alias){
        const delete_mouse = squel.delete()
            .from(this.name)
            .where('id_alias = ?', _id_alias)
            .toString()
        const delete_mouse_cage = squel.delete()
            .from('cage_mouse')
            .where('mouse_id = ?', _id_alias)
            .toString()
        return db.any(query)
    }

    update(model){
        // do related things
        if(model.cage_id){
            console.log('add mouse to cage')
            cage_mouse_controller
                .insert({cage_id: model.cage_id, mouse_id: model.id})
                .catch( (error) => {
                    utils.log_json(error)
                })
            delete model.cage_id
        }


        return super.update(model)
    }
}

module.exports = new Controller('mouse')
