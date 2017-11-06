const d = require('d');
const memoizeMethods = require('memoizee/methods');

const Base_Controller = require('./base_controller')
const utils = require('./utils_controller')
const Enum = require('../database/models').Enum

class Controller extends Base_Controller {

    by_type(_code) {
        return Enum.findAll({
            attributes: ['id', 'description'],
            where: { type: _code }
        })
    }

   by_type_map(_code) {
        return Enum.findAll({
                attributes: ['id', 'description'],
                where: { type: _code }
            })
            .then(enums => {
                let enum_id_map = {}
                enums.forEach(enoom => {
                    enum_id_map[enoom.description] = enoom.id
                })
                return enum_id_map
            })
    }

    get_or_create(_description, _code){
        return Enum.findOrCreate({
            attributes: ['id', 'description'],
            where: {type: _code, description: _description}
        })
        .spread((enoom, is_created) =>{
            console.log("new enum created: " + is_created)
            return enoom.get({plain: true}).id
        })

    }
}

const memoize_methods = {
    // by_type: d(_code => {
    //     return Enum.findAll({
    //         attributes: ['id', 'description'],
    //         where: { type: _code }
    //     })
    // }, { promise: true }),

    // by_type_map: d(_code => {
    //     return Enum.findAll({
    //             attributes: ['id', 'description'],
    //             where: { type: _code }
    //         })
    //         .then(enums => {
    //             let enum_id_map = {}
    //             enums.forEach(enoom => {
    //                 enum_id_map[enoom.description] = enoom.id
    //             })
    //             return enum_id_map
    //         })

    // }, { promise: true }),

    by_type_desc: d((_code, _description) => {
        return Enum.findOne({
            attributes: ['id', 'description'],
            where: { description: _description, type: _code }
        })
    }, { promise: true }),

    get: d(_id => {
        return Enum.findById(_id, { attributes: ['description'] })
    }, { promise: true })
}

Object.defineProperties(Controller.prototype, memoizeMethods(memoize_methods))

module.exports = new Controller(Enum)