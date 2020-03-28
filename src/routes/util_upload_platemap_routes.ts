import multer from 'multer';
import { StorageEngine } from 'multer';
import { join, parse } from 'path';
import csv from 'csvtojson';
import { Request } from 'express';
import { falsy } from 'is_js';
// import { Promise: bb } from "bluebird";
import { RedisClient } from 'redis';

import platemap_controller from '../controllers/platemap_controller';
import product_info_controller from '../controllers/product_info_controller';
import molecule_controller from '../controllers/molecule_controller';

const bb = require("bluebird");

const redis = require("redis");
const redis_config = {
    url : process.env.LOCAL_REDIS_URL,
    retry_strategy: function(options) {
          if (options.error && options.error.code === "ECONNREFUSED") {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error("The server refused the connection");
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error("Retry time exhausted");
          }
          if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
          }
          // reconnect after
           return Math.min(options.attempt * 100, 3000);
        }
}
const client: RedisClient = redis.createClient(redis_config);
// const client: RedisClient = redis.createClient();
// console.log(client.address);


client.on("error", function(error) {
    console.error(error);
  });

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
        max_solubility: (falsy(max_solubility) ? -1.0 : parseFloat(max_solubility)),
        molarity_mm: (falsy(molarity_mm) ? -1.0 : parseFloat(molarity_mm)),
        molarity_unit,
        name,
        pathway,
        platemap_id: -1,
        product_info_id: -1,
        smiles,
        targets,
        weight: (falsy(weight) ? -1.0 : parseFloat(weight)),
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
        cas_number: (falsy(cas_number) ? "EMPTY_CAS_NUMBER" : cas_number),
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

const update_progress_info = (token, progress_info) => {
    try{
        // console.log("start: set progress token");
        client.set(token, JSON.stringify(progress_info), (err, reply) => {
            if (err) {
                console.log("error: set progress token - " + err);
            }
            console.log("success: set progress token: " + JSON.stringify(progress_info.platemap_map, null, 2));
        });
        // console.log("end: set progress token");
    }
    catch (err) {
        console.log("err: update progress info - " + err);
    }
}

const cache = {}

let cache_product_info_hit = 0;
let cache_product_info_miss = 0;

const get_cache_hit_rate = () => {
    const total = cache_product_info_hit + cache_product_info_miss
    if (total == 0) {
        return 0.0;
    }
    else {
        return cache_product_info_hit / total * 100.0;
    }
}

const create_empty_product_info = async () => {
    const empty_product_info = {
        catalog_number: '',
        barcode: '',
        cas_number: "EMPTY_CAS_NUMBER",
        url: ''
    };
    let product_info_db;
    if (!(empty_product_info.cas_number in cache)) {
        const product_info_db_result_set = await product_info_controller.Model.findAll({
            attributes: ['id', 'cas_number'],
            where: { cas_number: empty_product_info.cas_number }
        });

        if (product_info_db_result_set.length > 0) {
            cache[product_info_db_result_set[0].cas_number] = product_info_db_result_set[0].id;
        }
        else {
            product_info_db = await product_info_controller.insert(empty_product_info)
                .catch(error => console.log(`error - product_info_controller insert empty : ${error}`));
            cache[product_info_db.cas_number] = product_info_db.id;
        }
    }
}

export const process_platemap_csv = async (csv_file_array: Express.Multer.File[], token: string) => {
    const progress_info = { csv_total: csv_file_array.length, platemap_map: {}, csv_count: 0, is_finished: false };
    update_progress_info(token, progress_info);

    await create_empty_product_info();

    for (let file of csv_file_array) {
        const rows = (await csv({ flatKeys: true }).fromFile(file.path))
            .map(reshape_keys)
        // create platemap
        const platemap = build_platemap(rows[0]);
        platemap.name = file.originalname;
        console.log("start create platemap: " + platemap.name);
        const platemap_id = await create_platemap_db(platemap);
        console.log("end create platemap: " + platemap.name);
        const row_total = rows.length;
        let row_count = 0;
        let row_percent = 0.0;
        const name = platemap.name;
        const platemap_progress_info = { name, row_total, row_count, row_percent, cache_product_info_hit, cache_product_info_miss, cache_product_info_hit_rate: get_cache_hit_rate() };
        progress_info.platemap_map[platemap.name] = platemap_progress_info

        let p_list = rows.map(extract_molecule_product_info)
            .map(async ({ molecule, product_info }) => {
                const product_info_id = await create_product_info_db(product_info);

                platemap_progress_info.cache_product_info_hit = cache_product_info_hit;
                platemap_progress_info.cache_product_info_miss = cache_product_info_miss;
                platemap_progress_info.cache_product_info_hit_rate = get_cache_hit_rate();

                molecule.product_info_id = product_info_id;
                molecule.platemap_id = platemap_id;
                await create_molecule_db(molecule);
                row_count += 1;
                row_percent = (row_count * 100.0) / row_total;
                platemap_progress_info.row_count = row_count;
                platemap_progress_info.row_percent = row_percent;
                console.log(`${platemap.name} - ${row_count} of ${row_total} = ${row_percent}`);
                progress_info.csv_count += 1;
                update_progress_info(token, progress_info);
                return Promise.resolve();
            });
        bb.all(p_list)
            .then(() => {
                console.log("finished")
                progress_info.is_finished = true;
                update_progress_info(token, progress_info);
            })
            .catch((err) => {
                console.log("error2: " + err);
            })
    }
    

}

const create_platemap_db = async (platemap: Platemap) => {
    let platemap_db;
    if (!(platemap.name in cache)) {
        // check db
        const platemap_db_result_set = await platemap_controller.Model.findAll({ where: { name: platemap.name }, attributes: ['id', 'name'] })
            .catch(error => console.log(`error - platemap controller findall: ${error}`));

        if (platemap_db_result_set.length >= 1) {
            platemap_db = platemap_db_result_set[0];
        }
        else {
            platemap_db = await platemap_controller.insert(platemap)
                .catch(error => console.log(`error - platemap controller insert: ${error}`));
        }
        cache[platemap.name] = platemap_db.id;
    }
    return cache[platemap.name];
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
        cache_product_info_miss += 1;
    }
    else {
        cache_product_info_hit += 1;
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