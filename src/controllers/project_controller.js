const BlueBird = require('bluebird');
const {falsy: isFalsey} = require('is_js');

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
        return all_projects.map(project => self.pretty(project));
    }

    insert(model) {
        // const self = this;
        const _model = utils.remove_empty(model, true);
        // if(isFalsey(_model.name)){
        //     _model.name = city_names[Math.floor(Math.random() * city_names.length)]
        // }
        return Project.create(_model, {
            returning: true,
        })
            .catch((err) => {
                console.error(err);
            });
    }

    update(model) {
        const _model = utils.remove_empty(model, true);

        return Project.update(_model, {
            where: { id: _model.id },
            returning: true,
        });
    }

    async get_experiments(id) {
        const project = await this.Model.findByPk(id);
        const experiments = await project.getExperiments({raw:true});
        return {project, experiments};
    }

    get model() {
        return Project;
    }
}

module.exports = new Project_Controller(Project);
