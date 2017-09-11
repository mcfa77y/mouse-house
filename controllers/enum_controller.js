const d = require('d');
const memoizeMethods = require('memoizee/methods');

const utils = require('./utils_controller')
const Enum = require('../database/models').Enum

class Controller {


}

const memoize_methods = {
    by_type: d(_code => {
        return Enum.findAll({
            attributes: ['id', 'description'],
            where: { type: _code }
        })
    }, { promise: true }),

    by_type_map: d(_code => {
        return this.by_type(_code)
            .then(enums => {
                let enum_id_map = {}
                enums.forEach(enum => {
                    enum_id_map[enum.description] = enum.id
                })
                return enum_id_map
            })

    }, { promise: true }),

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

module.exports = new Controller()