const {Base_Controller, db, squel, memoizeMethods, d} = require('./base_controller')

const TABLE_NAME = 'enum_type'
class Controller extends Base_Controller {

}
const memoize_methods = {
	getByCode: d((my_code) => {
        const find_by_code = squel.select()
            .from(TABLE_NAME)
            .where('code = \'' +  my_code + '\'')
            .toString()
        return db.one(find_by_code)
    }, {async: true})
}

Object.defineProperties(Controller.prototype, memoizeMethods(memoize_methods))

module.exports = new Controller(TABLE_NAME)
