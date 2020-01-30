import multer from 'multer';
import {StorageEngine} from 'multer';
import { join, parse } from 'path';
import csv from 'csvtojson';
import { Request } from 'express';

import platemap_controller from '../controllers/platemap_controller';
import product_info_controller from '../controllers/product_info_controller';
import molecule_controller from '../controllers/molecule_controller';


const TMP_DIR = join(__dirname, '../../tmp');

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

const build_molecule = (row) => {
    const {
        form,
        information: info,
        max_solubility_in_dmso_mm: max_solubility,
        molecule_name: name,
        pathway,
        smiles,
        target,
        mw: weight,
        molarity_mm,
        unit: molarity_unit,
        "384_well": cell,
        well_x: x,
        well_y: y,
    } = row;
    const result = {
        form,
        info,
        max_solubility,
        name,
        pathway,
        smiles,
        target,
        weight,
        molarity_mm,
        molarity_unit,
        cell, x, y
    }
    return result;
}

const build_product_info = (row) => {
    const {
        catalog_no: catalog_number,
        barcode,
        cas_number,
        url
    } = row;
    const result = { 
        catalog_number,
        barcode,
        cas_number,
        url }
    return result;
}

const build_platemap = (row) => {
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

export const process_csvs = async (csv_file_array: Express.Multer.File[], process_fn: (object) => object) => {
    const result = [];
    for (let file of csv_file_array) {
        const rows = await csv({ flatKeys: true }).fromFile(file.path)
        rows['originalname'] = file.originalname;
        const data = rows.map(process_fn)
        result.push(data);
        console.log(`data: ${JSON.stringify(data[0], null, 2)}`);
    }
    return result;
}

const cache = {}
const create_platemap = async(platemap) => {
    if (!(platemap.id_384 in cache)){
        const platemap_db = await platemap_controller.insert(platemap);
        cache[platemap.id_384] = platemap_db.id;
    }
    return cache[platemap.id_384];
}
export const transform_platemap_data = async (csv_row: object) => {
    const transform_0 = Object.keys(csv_row)
        .reduce((acc, key) => {
            const new_key = key
                .split(' ').join('_')
                .toLocaleLowerCase()
                .replace('.', '')
                .replace('(', '')
                .replace(')', '');
            acc[new_key] = csv_row[key];
            return acc;
        }, {})
    const molecule = build_molecule(transform_0);
    const product_info = build_product_info(transform_0);
    const platemap = build_platemap(transform_0);
    
    const platemap_id = create_platemap(platemap);

    let product_info_id = -1;
    if (product_info.cas_number in cache){
        product_info_id = cache[product_info.cas_number];
    }
    else {
        const product_info_db = product_info_controller.insert(product_info);
        cache[product_info.cas_number] = product_info_db.id;
    }
    
    
    return {
        molecule, product_info, platemap
    }
}
// end common stuff