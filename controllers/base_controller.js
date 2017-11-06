const utils = require('./utils_controller')
// Constructor
class Base_Controller {
    constructor(_Model) {
        // always initialize all instance properties
        this.Model = _Model;
    }
    all() {
        return this.Model.findAll()
    }
    get(_id) {
        return this.Model.findById(_id)
    }
    get_where(_where) {
       return this.Model.findAll({where: _where})
    }
    insert(_model_data) {
        _model_data = utils.remove_empty(_model_data)
        return this.Model.create(_model_data, {returning: true})
    }
    upsert(_model_data) {
        _model_data = utils.remove_empty(_model_data)
        return this.Model.upsert(_model_data)
    }
    update(_model_data) {
        _model_data = utils.remove_empty(_model_data)
        return this.Model.update(_model_data, {where: {id: _model_data.id}} )
    }
    delete(_id) {
        return this.delete_where({id: _id})
    }
    delete_where(_where){
        return this.Model.destroy({where: _where})
    }
}

// export the class instance
module.exports = Base_Controller;
