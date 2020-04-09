import { Request, Response } from 'express';

import platemap_controller from '../../controllers/platemap_controller';
import molecule_controller from '../../controllers/molecule_controller';
import experiment_controller from '../../controllers/experiment_controller';
import { identity } from '../../controllers/utils_controller';

const { default: image_index } = require('./data');
 
const get_molcule_meta_data = async (cell, platemap_id) => {
    let molecule_meta_data = [];

    const molecule_db = await molecule_controller.Model.findOne({
        attributes: ['cell',
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
const get_img = async (platemap_id, molecule_db) => {
    // const [row, col] = index.split('_').map((x) => parseInt(x, 10) + 1);

    const experiment_db_list = await experiment_controller.Model.findAll(
        {
            where: { platemap_id },
            attributes: ['human_readable_name', 'magnification']
        });
    let img_url_list = [];
    for (let experiment_db of experiment_db_list) {
        let experiment_name = experiment_db.human_readable_name + "-" + experiment_db.magnification;
        let cell = molecule_db.cell;
        for (let sector_id of ['s1', 's2', 's3', 's4']) {
            for (let wavelength_id of ['w1', 'w2', 'w3', 'w4']) {
                try{

                    const img_url = image_index['thumb'][experiment_name][cell][wavelength_id][sector_id]
                    img_url_list.push(img_url);
                }
                catch(err) {
                    console.log(err);
                    
                }
            }
        }
    }
    return img_url_list;
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
        let row_index = molecule.y - 1;
        let col_index = molecule.x - 1;
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

export const get_card_data = async (req: Request, res: Response) => {
    const {
        cell, platemap_id,
    } = req.body;

    const { molecule_meta_data, molecule_db } = await get_molcule_meta_data(cell, platemap_id)

    const img_url_list = await get_img(platemap_id, molecule_db);


    const card_data = {
        molecule_meta_data,
        name: `${molecule_db.name}`,
        img_url_list
        // id: path.parse(file).name,
        // row_zip,
        // column_headers: data.column_headers,
    };

    return card_data;
}