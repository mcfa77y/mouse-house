// const BlueBird = require('bluebird');
// const { falsy: isFalsey } = require('is_js');

const { identity, format_date } = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names;

const Base_Controller = require('./base_controller');
const { Image_Metadata } = require('../database/models');

class Image_Metadata_Controller extends Base_Controller {
    async pretty(model) {
        const {
            id, created_at, updated_at,
            wavelength,
            sector,
            uri,
        } = model;
        return {
            id,
            created_at: format_date(created_at),
            updated_at: format_date(updated_at),
            wavelength,
            sector,
            uri,
        };
    }

    async all_pretty() {
        const self = this;
        const all_models = await super.all();
        return all_models.map((model) => self.pretty(model));
    }

    insert(model) {
        // console.log(`_model: ${JSON.stringify(model, null, 2)}`);

        return Image_Metadata.create(model, { returning: true, attributes: ['id', 'uri'] })
            .then(identity)
            .catch((err) => {
                console.error(err);
                console.error(`duplicate: ${model.uri}`);
            });
    }

    update(model) {
        return Image_Metadata.update(model, {
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
        return Image_Metadata;
    }
}

module.exports = new Image_Metadata_Controller(Image_Metadata);
