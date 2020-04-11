// const BlueBird = require('bluebird');
// const { falsy: isFalsey } = require('is_js');

const { identity, format_date } = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names;

const Base_Controller = require('./base_controller');
const { Platemap } = require('../database/models');

class Platemap_Controller extends Base_Controller {
    async pretty(model) {
        const {
            id, name, created_at, updated_at,
            id_384,
            id_ucsc_csc,
            molarity_mm,
            molarity_unit,
            library,
            tags,
        } = model;
        return {
            id,
            name,
            created_at: format_date(created_at),
            updated_at: format_date(updated_at),
            id_384,
            id_ucsc_csc,
            molarity_mm,
            molarity_unit,
            library,
            tags,
        };
    }

    async all_pretty() {
        const self = this;
        const all_platemaps = await super.all();
        return all_platemaps.map((platemap) => self.pretty(platemap));
    }

    insert(model) {
        console.log(`_model: ${JSON.stringify(model, null, 2)}`);

        return Platemap.create(model, { returning: true, attributes: ['id'] })
            .then(identity)
            .catch((err) => {
                console.error(err);
            });
    }

    update(model) {
        return Platemap.update(model, {
            where: { id: model.id },
            returning: true,
        })
            .catch((err) => {
                console.error('platemap controller update');
                console.log(`err: ${JSON.stringify(err, null, 2)}`);
            });
    }

    // async get_experiments(id) {
    //     const platemap = await this.Model.findByPk(id);
    //     const experiments = await platemap.getExperiments({ attributes: ['id', 'name'],
    //     raw: true });
    //     return { platemap, experiments };
    // }

    get model() {
        return Platemap;
    }
}

module.exports = new Platemap_Controller(Platemap);
