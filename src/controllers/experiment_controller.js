// const { map } = require('bluebird');

const { format_date, remove_empty } = require('./utils_controller');

const Base_Controller = require('./base_controller');
const { Experiment } = require('../database/models');
// const platemap_controller = require('./platemap_controller');


class Experiment_Controller extends Base_Controller {
    async pretty(model) {
        const {
            id,
            image_name,
            measurement_name,
            dapi_w1,
            actin_w3,
            lectin_w2,
            tubulin_w2,
            ph3_w3,
            ph3_w4,
            edu_w2,
            calnexin_w4,
            gm130w4,
            controlplate,
            cell_lines,
            timepoint,
            magnification,
            cp_version,
            human_readable_name,
            experiment_date,
            ixmw1,
            ixmw2,
            ixmw3,
            ixmw4,
            created_at,
            updated_at,
        } = model;
        // const experiments = await model.getExperiments({ raw: true });
        const platemap_db = await model.getPlatemap({ attributes: ['name', 'id'] });

        return {
            created_at: format_date(created_at),
            updated_at: format_date(updated_at),
            id,
            image_name,
            measurement_name,
            dapi_w1,
            actin_w3,
            lectin_w2,
            tubulin_w2,
            ph3_w3,
            ph3_w4,
            edu_w2,
            calnexin_w4,
            gm130w4,
            controlplate,
            cell_lines,
            timepoint,
            magnification,
            cp_version,
            human_readable_name,
            experiment_date,
            ixmw1,
            ixmw2,
            ixmw3,
            ixmw4,
            platemap_name: platemap_db.name,
            platemap_id: platemap_db.id,
        };
    }

    // async all_pretty() {
    //     const self = this;
    //     return super.all()
    //         .then((items) => map(items, (item) => self.pretty(item)))
    //         .then((model_array) => model_array);
    // }

    insert(model) {
        const _model = remove_empty(model, true);
        return Experiment.create(_model, {
            returning: true,
        })
            .catch((err) => {
                console.error(err);
            });
    }

    update(model) {
        const _model = remove_empty(model, true);

        return Experiment.update(_model, {
            where: { id: _model.id },
            returning: true,
        });
    }

    get model() {
        return Experiment;
    }
}

module.exports = new Experiment_Controller(Experiment);
