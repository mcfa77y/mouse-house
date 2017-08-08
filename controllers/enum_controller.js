const d = require('d');
const memoizeMethods = require('memoizee/methods');

const utils = require('./utils_controller')
const Enum = require('../database/models').Enum

class Controller {


}

const memoize_methods = {
    by_code: d(_code => {
        return Enum.findAll({
            attributes: ['id', 'description'],
            where: { type: _code }
        })
    }, { promise: true }),

    by_code_desc: d((_code, _description) => {
        return Enum.findOne({
            attributes: ['id', 'description'],
            where: { description:  _description, type: _code }
        })
    }, { promise: true }),

    get: d(_id => {
        return Enum.findById(_id, { attributes: ['description'] })
    }, { promise: true })
}

Object.defineProperties(Controller.prototype, memoizeMethods(memoize_methods))

module.exports = new Controller()