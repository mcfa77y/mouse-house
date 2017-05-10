const enum_type_controller = require('./enum_type')
const Base_Controller = require('./base_controller')

class Controller extends Base_Controller {

    getByEnumTypeCode(my_code) {
        return enum_type_controller
            .getByCode(my_code)
            .then((results) => {
                return results[0].id
            })
            .then((enum_type_id) => {
                return this.models().then((enums) => {
                    return enums.find({

                        where: {
                            enumTypeId: enum_type_id
                        }
                    })
                })
            })
    }
}

module.exports = new Controller('enum', 'm', 'h')
