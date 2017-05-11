const {Base_Controller, db, squel} = require('./base_controller')
const enum_type_controller = require('./enum_type')

class Controller extends Base_Controller {
    getByEnumTypeCode(my_code) {
        return enum_type_controller.getByCode(my_code)
            .then((enum_type) => {
            	const find_by_code = squel.select()
		            .field('id')
		            .field('description')
		            .from('enum')
		            .where('enum_type_id = ?', enum_type.id)
		            .toString()
                return db.any(find_by_code)
            })
    }

    getByEnumTypeCodeAndDesc(my_code, my_description) {
        return enum_type_controller.getByCode(my_code)
            .then((enum_type) => {
            	const find_by_code = squel.select()
		            .field('id')
		            .from('enum')
		            .where('enum_type_id = ?', enum_type.id)
		            .where('description = ?', my_description)
		            .toString()
                return db.one(find_by_code)
            })
    }
}

module.exports = new Controller('enum')
