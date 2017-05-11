const {Base_Controller, db, squel} = require('./base_controller')

class Enum_Type extends Base_Controller {
    getByCode(my_code) {
        const find_by_code = squel.select()
            .from(this.name)
            .where('code = \'' +  my_code + '\'')
            .toString()
        return db.one(find_by_code)
    }
}

module.exports = new Enum_Type('enum_type')
