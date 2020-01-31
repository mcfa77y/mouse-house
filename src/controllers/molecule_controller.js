const BlueBird = require('bluebird');
const { falsy: isFalsey } = require('is_js');

const utils = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names;

const Base_Controller = require('./base_controller');
const { Molecule } = require('../database/models');

class Molecule_Controller extends Base_Controller {
    pretty(model) {
        const {
            id, name, created_at, updated_at,
            barcode,
            cas_number,
            catalog_number,
            form,
            info,
            max_solubility,
            pathway,
            smiles,
            targets,
            url,
            weight,
        } = model;
        // const experiments = await model.getExperiments({ raw: true });
        return {
            id,
            name,
            created_at: utils.format_date(created_at),
            updated_at: utils.format_date(updated_at),
            barcode,
            cas_number,
            catalog_number,
            form,
            info,
            max_solubility,
            pathway,
            smiles,
            targets,
            url,
            weight,
        };
    }

    async all_pretty() {
        const self = this;
        const all_molecules = await super.all();
        return all_molecules.map((molecule) => self.pretty(molecule));
    }

    insert(_model) {
        // console.log(`update molecule_model:\n ${JSON.stringify(_model, null, 2)}`);
        const { product_info_id, platemap_id } = _model;
        return Molecule.create(_model, { returning: true, attributes: ['id'] })
            .catch((err) => {
                console.error(err);
            });
    }

    update(model) {
        return Molecule.update(model, {
            where: { id: model.id },
            include: [{ association: Molecule.Product_Info }, { association: Molecule.Platemap }],
            returning: true,
        })
            .catch((err) => {
                console.error('molecule controller update');
                console.log(`err: ${JSON.stringify(err, null, 2)}`);
            });
    }

    // async get_experiments(id) {
    //     const molecule = await this.Model.findByPk(id);
    //     const experiments = await molecule.getExperiments({ attributes: ['id', 'name'],
    //     raw: true });
    //     return { molecule, experiments };
    // }

    get model() {
        return Molecule;
    }
}

module.exports = new Molecule_Controller(Molecule);
