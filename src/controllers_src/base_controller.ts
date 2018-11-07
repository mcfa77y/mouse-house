import {remove_empty} from './utils_controller';
// Constructor
export class Base_Controller {
    Model: any;
    constructor(_Model: any) {
        // always initialize all instance properties
        this.Model = _Model;
    }
    all() {
        return this.Model.findAll();
    }
    get(_id: number) {
        return this.Model.findById(_id);
    }
    get_where(_where:any) {
        return this.Model.findAll({ where: _where });
    }
    insert(model_data_original: any) {
        const model_data = remove_empty(model_data_original);
        return this.Model.create(model_data, { returning: true });
    }
    upsert(model_data_original: any) {
        const model_data = remove_empty(model_data_original);
        return this.Model.upsert(model_data);
    }
    update(model_data_original: any) {
        const model_data = remove_empty(model_data_original);
        return this.Model.update(model_data, { where: { id: model_data.id } });
    }
    delete(_id: number) {
        return this.delete_where({id: _id});
    }

    delete_where(_where: any) {
        return this.Model.destroy({ where: _where });
    }
}
export default Base_Controller;
// export the class instance
// module.exports = Base_Controller;
