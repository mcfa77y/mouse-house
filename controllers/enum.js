const {
    Base_Controller,
    db,
    squel,
    memoizeMethods,
    d,
    autoBind
} = require('./base_controller')
const enum_type_controller = require('./enum_type')

const TABLE_NAME = 'enum'
class Controller extends Base_Controller {


}
const memoize_methods = {
    by_code: d((_code) => {
        return enum_type_controller.getByCode(_code)
            .then((enum_type) => {
                const find_by_code = squel.select()
                    .field('id')
                    .field('description')
                    .from(TABLE_NAME)
                    .where('enum_type_id = ?', enum_type.id)
                    .toString()
                return db.any(find_by_code)
            })
    }, {
        async: true
    }),

    by_code_desc: d((_code, _description) => {
        return enum_type_controller.getByCode(_code)
            .then((enum_type) => {
                const find_by_code = squel.select()
                    .field('id')
                    .from(TABLE_NAME)
                    .where('enum_type_id = ?', enum_type.id)
                    .where('description = ?', _description)
                    .toString()
                return db.one(find_by_code)
            })
    }, {
        async: true
    }),

    get: d((_id) => {
        const query = squel.select()
            .field('description')
            .from(TABLE_NAME)
            .where('id = ?', _id)
            .toString()
        return db.one(query)
    }, {
        async: true
    })
}

Object.defineProperties(Controller.prototype, memoizeMethods(memoize_methods))

module.exports = new Controller(TABLE_NAME)
