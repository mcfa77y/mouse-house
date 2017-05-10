const Base_Controller = require('./base_controller')

class Enum_Type extends Base_Controller {
    getByCode(my_code) {
        console.log('self.name: ' + this.name())
        return this.models()
            .then((enumType) => {
                return enumType.find({
                    where: {
                        code: my_code
                    }
                })
            })
    }
}

module.exports = new Enum_Type('enum_type', 'j', 'l')
