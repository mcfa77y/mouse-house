const db = require('./database')
const enum_type_controller = require('./enum_type')
const Base_Controller = require('./base_controller')

function Controller (){
	Base_Controller.call('enum', 'j', 'l')	
} 

Controller.prototype.getByEnumTypeCode = function (my_code) {
    return enum_type_controller.getByCode(my_code)
        .then((results) => {
            return results[0].id
        })
        .then((enum_type_id) => {
            return this.models().find({
                where: {
                    enum_type_id
                }
            })
        })
}

module.exports = Controller