const {log_json, remove_empty} = require('./utils_controller');
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
        return this.Model.findByPk(_id);
    }

    get_where(_where) {
        return this.Model.findAll({ where: _where });
    }

    insert(model_data_original) {
        const model_data = remove_empty(model_data_original);
        return this.Model.create(model_data, { returning: true });
    }

    upsert(model_data_original) {
        const model_data = remove_empty(model_data_original);
        return this.Model.upsert(model_data);
    }

    update(model_data_original) {
        const model_data = remove_empty(model_data_original);
        return this.Model.update(model_data, { where: { id: model_data.id } });
    }

    delete(_id) {
        // rename id_alias when deleted
        const date = new Date();
        return this.get(_id)
            .then((model) => {
                model.id_alias = `${model.id_alias}_${date.toISOString()}`;
                return this.Model.update(model.dataValues, { where: { id: model.id }, returning: true });
            })
            .then((model) => {
                console.log(model);
                return this.delete_where({ id: model[1][0].id });
            })
            .catch((err) => {
                log_json(err);
            });
    }

    delete_where(_where) {
        return this.Model.destroy({ where: _where });
    }
}

// export the class instance
module.exports = Base_Controller;
