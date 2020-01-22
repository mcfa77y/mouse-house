const utils = require('./utils_controller');
const Base_Controller = require('./base_controller');
const { Experiment } = require('../database/models');

class Experiment_Controller extends Base_Controller {
    pretty(model) {
        const {
            id, name, note, created_at, updated_at,
            grid_data_uri,
            metadata_uri,
            image_config,
            tag_config,
        } = model;
        // const experiments = await model.getExperiments({ raw: true });
        return {
            id,
            name,
            note,
            created_at: utils.format_date(created_at),
            updated_at: utils.format_date(updated_at),
            grid_data_uri,
            metadata_uri,
            image_config,
            tag_config,
        };
    }

    async all_pretty() {
        const self = this;
        const all_experiments = await super.all();
        return all_experiments.map((experiment) => self.pretty(experiment));
    }

    insert(model) {
        const _model = utils.remove_empty(model, true);
        return Experiment.create(_model, {
            returning: true,
        })
            .catch((err) => {
                console.error(err);
            });
    }

    update(model) {
        const _model = utils.remove_empty(model, true);

        return Experiment.update(_model, {
            where: { id: _model.id },
            returning: true,
        });
    }

    async get_projects(id) {
        const experiment = await this.Model.findByPk(id);
        const projects = await experiment.getProjects({ raw: true });
        return { projects, experiment };
    }

    get model() {
        return Experiment;
    }
}

module.exports = new Experiment_Controller(Experiment);
