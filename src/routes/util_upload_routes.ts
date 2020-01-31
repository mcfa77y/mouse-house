import multer from 'multer';
import { StorageEngine } from 'multer';
import { join, parse } from 'path';
import csv from 'csvtojson';
import { Request } from 'express';
import { falsy } from 'is_js';

import platemap_controller from '../controllers/platemap_controller';
import product_info_controller from '../controllers/product_info_controller';
import molecule_controller from '../controllers/molecule_controller';


const TMP_DIR = join(__dirname, '../../tmp');

interface Molecule {
    form: string;
    info: string;
    max_solubility: number;
    name: string;
    pathway: string;
    smiles: string;
    targets: string;
    weight: number;
    molarity_mm: number;
    molarity_unit: string;
    cell: string;
    x: number;
    y: number;
    platemap_id: number;
    product_info_id: number
}

interface Product_Info {
    catalog_number: string;
    barcode: string;
    cas_number: string;
    url: string;
}

interface Platemap {
    id_384: string;
    id_ucsc_csc: string;
    library: string;
    name: string;
}
const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, TMP_DIR)
    },
    filename: function (req: Request, file, cb) {
        const x = parse(file.originalname);
        cb(null, x.name + '-' + Date.now() + x.ext)
    }
})

const upload = multer({ storage });

export const upload_fields = upload.fields([
    { name: 'platemap_csv_files', maxCount: 400 },
    { name: 'crc_csv', maxCount: 1 },
    { name: 'images_zip', maxCount: 1 },
]);

const build_molecule = (row): Molecule => {
    const {
        form,
        information: info,
        max_solubility_in_dmso_mm: max_solubility,
        molecule_name: name,
        pathway,
        smiles,
        targets,
        mw: weight,
        molarity_mm,
        unit: molarity_unit,
        "384_well": cell,
        well_x: x,
        well_y: y,
    } = row;
    const result: Molecule = {
        cell, x, y,
        form,
        info,
        max_solubility: (falsy(max_solubility)? -1.0: parseFloat(max_solubility)),
        molarity_mm: (falsy(molarity_mm)? -1.0: parseFloat(molarity_mm)),
        molarity_unit,
        name,
        pathway,
        platemap_id: -1,
        product_info_id: -1,
        smiles,
        targets,
        weight,
    }
    return result;
}

const build_product_info = (row): Product_Info => {
    const {
        catalog_no: catalog_number,
        barcode,
        cas_number,
        url,
    } = row;
    const result = {
        catalog_number,
        barcode,
        cas_number: (falsy(cas_number)? "EMPTY_CAS_NUMBER": cas_number),
        url
    }
    return result;
}

const build_platemap = (row): Platemap => {
    const {
        "384_plate_id": id_384,
        ucsc_csc_plate_id: id_ucsc_csc,
        library,
        originalname: name,
    } = row;
    const result = {
        id_384, id_ucsc_csc, library, name
    }
    return result;
}


export const process_platemap_csv = async (csv_file_array: Express.Multer.File[]) => {
    const result = [];
    for (let file of csv_file_array) {
        const rows = (await csv({ flatKeys: true }).fromFile(file.path))
            .map(reshape_keys)
        // create platemap
        const platemap = build_platemap(rows[0]);
        platemap.name = file.originalname;
        const platemap_id = await create_platemap_db(platemap);

        rows.map(extract_molecule_product_info)
            .forEach(async ({ molecule, product_info }) => {
                const product_info_id = await create_product_info_db(product_info);
                molecule.product_info_id = product_info_id;
                molecule.platemap_id = platemap_id;
                await create_molecule_db(molecule);
            })

        // result.push(data);
        // console.log(`data: ${JSON.stringify(data[0], null, 2)}`);
    }
    return result;
}

const cache = {}
const create_platemap_db = async (platemap: Platemap) => {
    let platemap_db;
    if (!(platemap.id_384 in cache)) {
        // check db
        const platemap_db_result_set = await platemap_controller.Model.findAll({ where: { id_384: platemap.id_384 }, attributes: ['id', 'id_384'] })
            .catch(error => console.log(`error - platemap controller findall: ${error}`));

        if (platemap_db_result_set.length >= 1) {
            platemap_db = platemap_db_result_set[0];
        }
        else {
            platemap_db = await platemap_controller.insert(platemap)
                .catch(error => console.log(`error - platemap controller insert: ${error}`));
        }
        cache[platemap.id_384] = platemap_db.id;
    }
    return cache[platemap.id_384];
}

const create_product_info_db = async (product_info: Product_Info) => {
    let product_info_db;
    let cas_number = (product_info.cas_number === "") ? "EMPTY_CAS_NUMBER" : product_info.cas_number;
    if (!(cas_number in cache)) {
        // check if already in db
        const product_info_db_result_set = await product_info_controller.Model.findAll({ where: { cas_number }, attributes: ['id'] })
            .catch(error => console.log(`error - product_info_controller get_where: ${error}`));
        if (product_info_db_result_set.length >= 1) {
            product_info_db = product_info_db_result_set[0];
        }
        else {
            product_info_db = await product_info_controller.insert(product_info)
                .catch(error => console.log(`error - product_info_controller insert: ${error}`));
        }
        cache[product_info.cas_number] = product_info_db.id;
    }
    return cache[product_info.cas_number];
}

const create_molecule_db = async (molecule: Molecule) => {
    const molecule_db = await molecule_controller.insert(molecule);
    return molecule_db.id;
}

// convert to lowercase, replace space with underscore
// remove punctuations on keys
const reshape_keys = (csv_row_raw: object) => {
    return Object.keys(csv_row_raw)
        .reduce((acc, key) => {
            const new_key = key
                .split(' ').join('_')
                .toLocaleLowerCase()
                .replace('.', '')
                .replace('(', '')
                .replace(')', '');
            acc[new_key] = csv_row_raw[key];
            return acc;
        }, {})
}

const extract_molecule_product_info = (csv_row: object) => {
    const molecule = build_molecule(csv_row);
    const product_info = build_product_info(csv_row);
    return {
        molecule, product_info
    }
}
// end common stuff