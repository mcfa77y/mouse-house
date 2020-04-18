import { Request, Response } from 'express';

import platemap_controller from '../../controllers/platemap_controller';
import molecule_controller from '../../controllers/molecule_controller';
import image_metadata_controller from '../../controllers/image_metadata_controller';
import experiment_controller from '../../controllers/experiment_controller';
import { Op } from "sequelize";
import { expr_img_meta_to_json_map } from '../../process_experiment_images';
import { readFileSync } from 'fs';

const EXPR_IMG_META_TO_JSON_MAP = expr_img_meta_to_json_map();

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

let cache_image_meta_data = new Map();
const get_img_from_json = async (platemap_id, molecule_cell) => {
    const key = `p${platemap_id}_mc${molecule_cell}`;
    if (cache_image_meta_data.has(key)) {
        return cache_image_meta_data.get(key);
    }
    const experiment_db_list = await experiment_controller.Model
        .findAll({
            where: {
                platemap_id,
            },
            attributes: ['human_readable_name'],
            raw: true
        });

    const experiment_hrn_list = experiment_db_list
        .map(val => val['human_readable_name'].toLowerCase());

    const image_metadata_list = experiment_hrn_list
        .map((experiment_hrn) => {
            const key_expr_img_meta_json = `hrn_${experiment_hrn}`;
            if (cache_image_meta_data.has(key_expr_img_meta_json)) {
                return cache_image_meta_data.get(key_expr_img_meta_json);
            }
            const image_metadata_uri = EXPR_IMG_META_TO_JSON_MAP[experiment_hrn];
            const image_metadata_buffer = readFileSync(image_metadata_uri).toString();
            const image_metadata = JSON.parse(image_metadata_buffer);
            cache_image_meta_data.set(key_expr_img_meta_json, image_metadata);
            return image_metadata;

        })
        .map((image_metadata) => {
            return image_metadata[molecule_cell];
        })
        .reduce((acc, val) => {
            acc = acc.concat(val);
            return acc;
        }, []);

    // make map where key is [cyto|edu]_[minus|plus]_lps > wave > sector.uri
    /*
        drug > -/+ lps > w > s > uri
    */
    const sector_count = 4;
    const wavelength_struct = { overlay: new Array(sector_count), w1: new Array(sector_count), w2: new Array(sector_count), w3: new Array(sector_count), w4: new Array(sector_count) };
    const lps_struct = {
        lps_minus: { ...wavelength_struct },
        lps_plus: { ...wavelength_struct }
    };
    const card_image_metadata = {
        cyto: {
            ...lps_struct
        },
        edu: {
            ...lps_struct
        },
    };
    for (let image_metadata of image_metadata_list) {
        const { wavelength,
            sector,
            uri,
            feature,
            stain,
            lps_status } = image_metadata;

        let wl = `w${wavelength}`;
        if ("composite" === feature) {
            wl = 'overlay'
        }
        card_image_metadata[stain][lps_status][wl][sector - 1] = { uri, stain, lps_status, wavelength, sector };
    }
    cache_image_meta_data.set(key, card_image_metadata);
    return card_image_metadata;
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
    const grid = [];
    for (let molecule of molecule_db_list) {
        let row_index = molecule.y - 1;
        let col_index = molecule.x;
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

    let offset = 'A'.charCodeAt(0);
    // do row headers
    for (let row = 0; row < grid.length; row++) {
        // column_headers.push(String.fromCharCode(i + offset));
        let name = String.fromCharCode(row + offset);
        grid[row][0] = { name, cell: "-1" };
    }

    let column_headers = ["x"];
    for (let i = 0; i < grid[0].length - 1; i++) {
        // column_headers.push(String.fromCharCode(i + offset));
        column_headers.push((i + 1) + '')
    }
    return { grid, column_headers, platemap_db };
}

export const get_card_data = async (cell, platemap_id) => {

    const { molecule_meta_data, molecule_db } = await get_molcule_meta_data(cell, platemap_id)
    const drug = await get_img_from_json(platemap_id, molecule_db.cell);

    const card_data = {
        id: molecule_db.id,
        molecule_meta_data,
        name: `${molecule_db.name}`,
        drug
    };

    return card_data;
}