import { remove_empty } from './utils_controller';
import sequelize = require('sequelize');

// import Bluebird from 'bluebird';
// const BlueBird = P.Promise;

// Constructor
export abstract class Base_Controller {
    Model: sequelize.Model< I, A>;
    constructor(_Model: sequelize.Model<I, A>) {
        // super();
        // always initialize all instance properties
        this.Model = _Model;
    }
    async all() {
        return await this.Model.findAll();
    }

    async insert(model_original: any) {
        const model = remove_empty(model_original);
        return this.Model.create(model, { returning: true });
    }

    upsert(model_original: any) {
        const model = remove_empty(model_original);
        return this.Model.upsert(model);
    }
    delete(model: any) {
        return this.Model.destroy({where:{id:model.id}})
    }
    get(id?: number) {
        return this.Model.findOne({where:{id:id}})
    }
    // update(model_original: any) {
    //     const model = remove_empty(model_original);
    //     return this.Model.update(model, { where: { id: model.id } });
    // }

    get model() {
        return this.Model;
    }
}
// export default Base_Controller;
// export the class instance
// module.exports = Base_Controller;
