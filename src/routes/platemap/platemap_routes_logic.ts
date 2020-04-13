import { Request, Response } from 'express';

import platemap_controller from '../../controllers/platemap_controller';
import molecule_controller from '../../controllers/molecule_controller';
import image_metadata_controller from '../../controllers/image_metadata_controller';
import experiment_controller from '../../controllers/experiment_controller';
import { sanitize_string } from '../utils_routes';
const { Op } = require("sequelize");
// import { identity } from '../../controllers/utils_controller';

// const { default: image_index } = require('./data');

const get_molcule_meta_data = async (cell, platemap_id) => {
    let molecule_meta_data = [];

    const molecule_db = await molecule_controller.Model.findOne({
        attributes: [
            'id',
            'cell',
            'form',
            'info',
            'max_solubility',
            'molarity_mm',
            'molarity_unit',
            'name',
            'pathway',
            'smiles',
            'targets',
            'weight',
            'x',
            'y',
            'platemap_id'],
        where: {
            cell,
            platemap_id
        },
        include: [{
            association: molecule_controller.Model.Product_Info,
            attributes: ['barcode', 'cas_number', 'catalog_number', 'url',]
        }],
    })

    if (molecule_db !== undefined) {
        const molecule_field_skip = new Set(['product_info', 'platemap_id']);
        const molecule_cs = Object.keys(molecule_db.dataValues)
            .filter((key) => !molecule_field_skip.has(key))
            .reduce((acc, key) => {
                acc.push({ name: key, class_name: key, value: molecule_db.dataValues[key] });
                return acc;
            }, []);

        const product_info_db = molecule_db.product_info;
        const product_info_cs = Object.keys(product_info_db.dataValues)
            .reduce((acc, key) => {
                acc.push({ name: key, class_name: key, value: product_info_db.dataValues[key] });
                return acc;
            }, []);

        molecule_meta_data = [...molecule_cs, ...product_info_cs];
    }
    return { molecule_meta_data, molecule_db };
}

const get_img_2 = async (platemap_id, molecule_db) => {
    // const [row, col] = index.split('_').map((x) => parseInt(x, 10) + 1);

    let img_url_list = [];
    const experiment_db_list = await experiment_controller.Model.findAll(
        {
            where: {
                platemap_id,
            },
            attributes: ['id'],
            raw: true
        });
    const experiment_id_list = experiment_db_list.reduce((acc, val) => {
        acc.push(val.id);
        return acc;
    }, []);


    const foo = await image_metadata_controller.Model.findAll({
        where: {
            molecule_id: molecule_db.id,
            experiment_id: {
                [Op.in]: experiment_id_list
            },
            size: 'full',
        },
        include: [{
            association: image_metadata_controller.Model.Experiment,
            attributes: ['human_readable_name']
        }],
        raw: true,
    })
        .catch((err) => {
            console.error("image metadata find all error");
            console.error(err);
        })

    const drug_list = ['edu', 'cyto']
    // console.log(foo);
    // make map where key is [cyto|edu]_[minus|plus]_lps > wave > sector.uri
    /*
        drug > -/+ lps > w > s > uri
    */
   const wavelength_count = 4;
   const sector_count = 4;
    const fizz = {
        cyto: {
            lps_minus: {w1:new Array(sector_count), w2:new Array(sector_count), w3:new Array(sector_count), w4:new Array(sector_count)},
            lps_plus: {w1:new Array(sector_count), w2:new Array(sector_count), w3:new Array(sector_count), w4:new Array(sector_count)}
        },
        edu: {
            lps_minus: {w1:new Array(sector_count), w2:new Array(sector_count), w3:new Array(sector_count), w4:new Array(sector_count)},
            lps_plus: {w1:new Array(sector_count), w2:new Array(sector_count), w3:new Array(sector_count), w4:new Array(sector_count)}
        },
    };
    for (let bar of foo) {
        const { wavelength, sector, uri } = bar;
        let human_readable_name = bar['experiment.human_readable_name'].toLowerCase();
        let stain = '';
        let lps_status = '';
        if (human_readable_name.includes('edu')) {
            stain = 'edu'
        }
        else if (human_readable_name.includes('cyto')) {
            stain = 'cyto';
        }
        if (human_readable_name.includes('lps')) {
            lps_status = 'lps_plus';
        }
        else {
            lps_status = 'lps_minus';
        }
        const wl = `w${wavelength}`;
        fizz[stain][lps_status][wl][sector - 1] = { uri, stain, lps_status, wavelength, sector };
    }
    
    return fizz;
}


const get_img = async (platemap_id, molecule_db) => {
    // const [row, col] = index.split('_').map((x) => parseInt(x, 10) + 1);

    let img_url_list = [];
    const experiment_db_list = await experiment_controller.Model.findAll(
        {
            where: {
                platemap_id,
            },
            attributes: ['id'],
            raw: true
        });
    const experiment_id_list = experiment_db_list.reduce((acc, val) => {
        acc.push(val.id);
        return acc;
    }, []);


    const foo = await image_metadata_controller.Model.findAll({
        where: {
            molecule_id: molecule_db.id,
            experiment_id: {
                [Op.in]: experiment_id_list
            },
            size: 'full',
        },
        include: [{
            association: image_metadata_controller.Model.Experiment,
            attributes: ['human_readable_name']
        }],
        raw: true,
    })
        .catch((err) => {
            console.error("image metadata find all error");
            console.error(err);
        })

    const drug_list = ['edu', 'cyto']
    // console.log(foo);
    // make map where key is [cyto|edu]_[minus|plus]_lps > wave > sector.uri
    /*
        drug > -/+ lps > w > s > uri
    */
    const fizz = {
        cyto: {
            lps_minus: [],
            lps_plus: []
        },
        edu: {
            lps_minus: [],
            lps_plus: []
        },
    };
    const wavelength_count = 4;
    const sector_count = 4;
    for (let bar of foo) {
        const { wavelength, sector, uri } = bar;
        let human_readable_name = bar['experiment.human_readable_name'].toLowerCase();
        let stain = '';
        let lps_status = '';
        if (human_readable_name.includes('edu')) {
            stain = 'edu'
        }
        else if (human_readable_name.includes('cyto')) {
            stain = 'cyto';
        }
        if (human_readable_name.includes('lps')) {
            lps_status = 'lps_plus';
        }
        else {
            lps_status = 'lps_minus';
        }
        let wavelength_list = fizz[stain][lps_status];
        let sector_list = wavelength_list[wavelength - 1]
        if (sector_list == undefined) {
            wavelength_list[wavelength - 1] = new Array(sector_count);
            sector_list = wavelength_list[wavelength - 1]
        }
        sector_list[sector - 1] = { uri, stain, lps_status, wavelength, sector };
    }
    
    return fizz;
}

export const create_platemap_grid = async (req: Request, res: Response) => {
    const platemap_db = await platemap_controller.get(req.params.platemap_id);
    if (platemap_db == false) {
        // TODO: return missing table page
    }
    const molecule_db_list = await platemap_db.getMolecules()
        .catch((err) => {
            console.error(err);
        });
    // reshape map in to rows/cols
    const grid = {};
    for (let molecule of molecule_db_list) {
        let row_index = molecule.x - 1;
        let col_index = molecule.y - 1;
        let row = grid[row_index];
        if (row == undefined) {
            grid[row_index] = []
            row = grid[row_index]
        }

        let col = row[col_index];
        if (col == undefined) {
            grid[row_index][col_index] = { name: molecule.name, cell: molecule.cell };
        }
    }

    // get tag info for cell
    /*
    [{"tag": "green", "row_col": "10_3"},
     {"tag": "green", "row_col": "10_5"},
     {"tag": "green", "row_col": "11_4"},
     {"tag": "green", "row_col": "12_3"},
     {"tag": "green", "row_col": "12_5"}]
    */
    if (platemap_db.tags) {
        for (let cell of platemap_db.tags) {
            const [row, col] = cell.row_col.split('_').map((x) => parseInt(x, 10));
            grid[row][col].tag = cell.tag;
        }
    }
    let column_headers = [];
    let offset = 'A'.charCodeAt(0);
    for (let i = 0; i < grid[0].length; i++) {
        column_headers.push(String.fromCharCode(i + offset));
    }
    return { grid, column_headers, platemap_db };
}

export const get_card_data = async (cell, platemap_id) => {

    const { molecule_meta_data, molecule_db } = await get_molcule_meta_data(cell, platemap_id)

    const drug_foo = await get_img(platemap_id, molecule_db);
    const drug_bar = await get_img_2(platemap_id, molecule_db);

    
    const id = sanitize_string(molecule_db.name);
    const card_data = {
        id,
        molecule_meta_data,
        name: `${molecule_db.name}`,
        drug_foo,
        drug_bar
        // id: path.parse(file).name,
        // row_zip,
        // column_headers: data.column_headers,
    };

    return card_data;
}