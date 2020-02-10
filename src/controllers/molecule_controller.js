const BlueBird = require('bluebird');
const { falsy: isFalsey } = require('is_js');
const { Op } = require('sequelize');
const utils = require('./utils_controller');
// const city_names = require('../lib/data/city_names.json').city_names;

const Base_Controller = require('./base_controller');
const { Molecule, Platemap, Product_Info } = require('../database/models');

const TYPE_STRING = 'string';
const TYPE_NUMBER = 'number';
const TYPE_DATE = 'date';
class Molecule_Controller extends Base_Controller {
    pretty(model) {
        const {
            id,
            name,
            created_at,
            updated_at,
            barcode,
            cas_number,
            catalog_number,
            cell,
            form,
            info,
            max_solubility,
            molarity_mm,
            molarity_unit,
            pathway,
            smiles,
            targets,
            url,
            weight,
            x,
            y,
            platemap,
            product_info,
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
            cell,
            form,
            info,
            max_solubility,
            molarity_mm,
            molarity_unit,
            pathway,
            smiles,
            targets,
            url,
            weight,
            x,
            y,
            platemap_name: platemap.name,
            product_info: product_info.cas_number,
        };
    }

    annotate_columns(columns) {
        const type_map = {
            name: TYPE_STRING,
            form: TYPE_STRING,
            info: TYPE_STRING,
            molarity_unit: TYPE_STRING,
            pathway: TYPE_STRING,
            smiles: TYPE_STRING,
            targets: TYPE_STRING,
            cell: TYPE_STRING,
            platemap_name: TYPE_STRING,
            product_info: TYPE_STRING,
            max_solubility: TYPE_NUMBER,
            molarity_mm: TYPE_NUMBER,
            weight: TYPE_NUMBER,
            x: TYPE_NUMBER,
            y: TYPE_NUMBER,
            updated_at: TYPE_DATE,
            created_at: TYPE_DATE,
        };
        // key by data value
        return columns.map((col) => {
            col.type = type_map[col.data];
            return col;
        });
    }

    build_where(columns) {
        const where = {};
        const filtered_cols = columns
            .filter(({ searchable }) => searchable === 'true')
            .filter(({ search }) => search.value !== '')
            .filter(
                ({ data }) => data !== 'platemap_name' && data !== 'product_info',
            );

        this.annotate_columns(filtered_cols)
            .forEach(({ data, search, type }) => {
                // search is a list
                const search_values = this.build_like_array(search);
                if (type === TYPE_STRING) {
                    where[data] = {
                        [Op.iLike]: { [Op.any]: search_values },
                    };
                } else if (type === TYPE_NUMBER) {
                    where[data] = parseFloat(search.value);
                }
            });

        return where;
    }

    build_like_array(search) {
        return search.value.split(',').map((value) => `%${value.trim()}%`);
    }

    build_include_helper(model_db, column_name, search, as) {
        let search_values = [];
        if (search.value !== '') {
            search_values = this.build_like_array(search);
        }
        const include = { model: model_db, as };
        if (search_values.length > 0) {
            const where = {};
            where[column_name] = {
                [Op.iLike]: { [Op.any]: search_values },
            };
            include.where = where;
        }
        return include;
    }

    build_include(columns) {
        const include = [];
        columns
            .filter(
                ({ data }) => data === 'platemap_name' || data === 'product_info',
            )
            .forEach(({ data, search }) => {
                if (data === 'platemap_name') {
                    include.push(
                        this.build_include_helper(Platemap, 'name', search, 'platemap'),
                    );
                }
                if (data === 'product_info') {
                    include.push(
                        this.build_include_helper(
                            Product_Info,
                            'cas_number',
                            search,
                            'product_info',
                        ),
                    );
                }
            });
        return include;
    }

    build_order(columns, order) {
        let column_name = columns[order[0].column].data;
        const { dir } = order[0];
        if (column_name === 'platemap_name') {
            column_name = 'name';
            const model = Platemap;
            return [[{ model, as: 'platemap' }, column_name, dir]];
        }
        return [[column_name, dir]];
    }

    async some_pretty({
        limit, offset, columns, search, order,
    }) {
        const self = this;
        let all_molecules;
        let molecules;
        const where = this.build_where(columns);
        const include = this.build_include(columns);
        const order_by = this.build_order(columns, order);
        const base_config = {
            include,
            where,
            order: order_by,
        };
        if (limit > 0) {
            const config = Object.assign(base_config, { limit, offset });
            all_molecules = await Molecule.findAndCountAll(config).catch((error) => {
                console.log(`error - find some molecule: ${error}`);
                console.log(`error - find some molecule stack:\n ${error.stack}`);
            });
            molecules = all_molecules.rows.map((molecule) => self.pretty(molecule));
        } else {
            all_molecules = await Molecule.findAll(base_config).catch((error) => {
                console.log(`error - find all molecule: ${error}`);
            });
            molecules = all_molecules.map((molecule) => self.pretty(molecule));
        }
        return {
            molecules,
            count: all_molecules.count,
        };
    }

    async all_pretty() {
        const self = this;
        // const all_molecules = await super.all();
        const all_molecules = await Molecule.findAll({
            include: ['platemap', 'product_info'],
        }).catch((error) => console.log(`error - find all molecule: ${error}`));

        return all_molecules.map((molecule) => self.pretty(molecule));
    }

    insert(_model) {
    // console.log(`update molecule_model:\n ${JSON.stringify(_model, null, 2)}`);
        const { product_info_id, platemap_id } = _model;
        return Molecule.create(_model, {
            returning: true,
            attributes: ['id'],
        }).catch((err) => {
            console.error(err);
        });
    }

    update(model) {
        return Molecule.update(model, {
            where: { id: model.id },
            include: [
                { association: Molecule.Product_Info },
                { association: Molecule.Platemap },
            ],
            returning: true,
        }).catch((err) => {
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
