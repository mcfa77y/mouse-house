const db = require('./database')
const Base_Controller = require('./base_controller')

function Enum_Type() {
    Base_Controller.call('enum_type', 'm', 'h')
}

Enum_Type.prototype.getByCode = (my_code) => {
    console.log('self.name: ' + this.name())
    this.models().then((enumType) => {
        enumType.find({
            where: {
                code: my_code
            }
        }).then((results) => {
            return results
        })
    })
}
module.exports = Enum_Type
