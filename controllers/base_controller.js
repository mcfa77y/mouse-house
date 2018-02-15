const utils = require('./utils_controller');
// Constructor
class Base_Controller {
    constructor(_Model) {
        // always initialize all instance properties
        this.Model = _Model;
    }
    all() {
        return this.Model.findAll();
    }
    get(_id) {
        return this.Model.findById(_id);
    }
    get_where(_where) {
        return this.Model.findAll({ where: _where });
    }
    insert(model_data_original) {
        const model_data = utils.remove_empty(model_data_original);
        return this.Model.create(model_data, { returning: true });
    }
    upsert(model_data_original) {
        const model_data = utils.remove_empty(model_data_original);
        return this.Model.upsert(model_data);
    }
    update(model_data_original) {
        const model_data = utils.remove_empty(model_data_original);
        return this.Model.update(model_data, { where: { id: model_data.id } });
    }
    delete(_id) {
        return this.delete_where({ id: _id });
    }
    delete_where(_where) {
        return this.Model.destroy({ where: _where });
    }
}

// export the class instance
module.exports = Base_Controller;
