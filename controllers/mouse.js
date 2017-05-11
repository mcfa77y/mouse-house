const {
    Base_Controller,
    db,
    squel
} = require('./base_controller')
const enum_type_controller = require('./enum_type')
const enum_controller = require('./enum')

class Controller extends Base_Controller {
    getMaleMiceForSelect() {
        return enum_controller.getByEnumTypeCodeAndDesc('SEX', 'male')
            .then((result) => {
                const query = squel.select()
                    .field('id')
                    .field('id', 'description')
                    .from(this.name)
                    .where('sex_id = ?', result.id)
                    .toString()
                console.log('male: ' + query)
                return db.any(query)

            })

    }
    getFemaleMiceForSelect() {
        return enum_controller.getByEnumTypeCodeAndDesc('SEX', 'female')
            .then((result) => {
                const query = squel.select()
                    .field('id')
                    .field('id', 'description')
                    .from(this.name)
                    .where('sex_id = ?', result.id)
                    .toString()
                console.log('male: ' + query)
                return db.any(query)

            })

    }
}

module.exports = new Controller('mouse')
