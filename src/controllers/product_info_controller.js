// const BlueBird = require('bluebird');
// const { falsy: isFalsey } = require('is_js');

import { identity } from './utils_controller';

const { format_date } = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names;

const Base_Controller = require('./base_controller');
const { Product_Info } = require('../database/models');

class Product_Info_Controller extends Base_Controller {
    async pretty(model) {
        const {
            id, created_at, updated_at,
            barcode,
            cas_number,
            catalog_number,
            url,
        } = model;
        // const experiments = await model.getExperiments({ raw: true });
        return {
            id,
            created_at: format_date(created_at),
            updated_at: format_date(updated_at),
            barcode,
            cas_number,
            catalog_number,
            url,
        };
    }

    async all_pretty() {
        const self = this;
        const all_product_infos = await super.all();
        return all_product_infos.map((product_info) => self.pretty(product_info));
    }

    insert(model) {
        console.log(`_model: ${JSON.stringify(model, null, 2)}`);

        return Product_Info.create(model, { returning: true })
            .then(identity)
            .catch((err) => {
                console.error(err);
            });
    }

    update(model) {
        return Product_Info.update(model, {
            where: { id: model.id },
            returning: true,
        })
            .catch((err) => {
                console.error('product_info controller update');
                console.log(`err: ${JSON.stringify(err, null, 2)}`);
            });
    }

    // async get_experiments(id) {
    //     const product_info = await this.Model.findByPk(id);
    //     const experiments = await product_info.getExperiments({ attributes: ['id', 'name'],
    //     raw: true });
    //     return { product_info, experiments };
    // }

    get model() {
        return Product_Info;
    }
}

// module.exports = new Product_Info_Controller(Product_Info);
export default new Product_Info_Controller(Product_Info);
