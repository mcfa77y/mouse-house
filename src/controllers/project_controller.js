const BlueBird = require('bluebird');
const { falsy: isFalsey } = require('is_js');

const utils = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names;

const Base_Controller = require('./base_controller');
const { Project } = require('../database/models');

class Project_Controller extends Base_Controller {
    pretty(model) {
        const {
            id, name, note, created_at, updated_at,
        } = model;
        // const experiments = await model.getExperiments({ raw: true });
        return {
            id,
            name,
            note,
            created_at: utils.format_date(created_at),
            updated_at: utils.format_date(updated_at),
        };
    }

    async all_pretty() {
        const self = this;
        const all_projects = await super.all();
        return all_projects.map((project) => self.pretty(project));
    }

    insert(model) {
        console.log(`_model: ${JSON.stringify(model, null, 2)}`);

        return Project.create(model, { returning: true })
            .then((proj_model) => {
                const { experiments } = model;
                if (Array.isArray(experiments) && experiments.length) {
                    return proj_model.setExperiments(experiments);
                }
                return proj_model;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    update(model) {
        return Project.update(model, {
            where: { id: model.id },
            include: [{ association: Project.Experiments }],
            returning: true,
        })
            .catch((err) => {
                console.error('proj controller update');
                console.log(`err: ${JSON.stringify(err, null, 2)}`);
            });
    }

    async get_experiments(id) {
        const project = await this.Model.findByPk(id);
        const experiments = await project.getExperiments({
            attributes: ['id'],
            raw: true,
        });
        return { project, experiments };
    }

    get model() {
        return Project;
    }
}

module.exports = new Project_Controller(Project);
