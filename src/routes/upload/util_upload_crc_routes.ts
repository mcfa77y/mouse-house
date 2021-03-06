import csv from 'csvtojson';
import { falsy } from 'is_js';
import { all } from 'bluebird';

import platemap_controller from '../../controllers/platemap_controller';
import experiment_controller from '../../controllers/experiment_controller';
import { client } from './util_upload_common_routes';

interface Experiment {
    image_name: string,
    measurement_name: string,
    platemap_name: string,
    platemap_id: number,
    dapi_w1: number,
    actin_w3: number,
    lectin_w2: number,
    tubulin_w2: number,
    ph3_w3: number,
    ph3_w4: number,
    edu_w2: number,
    calnexin_w4: number,
    gm130w4: number,
    controlplate: number,
    cell_lines: string,
    timepoint: string,
    magnification: string,
    cp_version: number,
    human_readable_name: string,
    experiment_date: string,
    ixmw1: string,
    ixmw2: string,
    ixmw3: string,
    ixmw4: string,
}

const build_experiment = (row): Experiment => {
    const {
        image_name,
        measurement_name,
        plate_map_file,
        dapi_w1,
        actin_w3,
        lectin_w2,
        tubulin_w2,
        ph3_w3,
        ph3_w4,
        edu_w2,
        calnexin_w4,
        gm130w4,
        controlplate,
        cell_lines,
        timepoint,
        magnification,
        cp_version,
        human_readable_name,
        experiment_date,
        ixmw1,
        ixmw2,
        ixmw3,
        ixmw4,
    } = row;
    const result = {
        image_name,
        measurement_name,
        dapi_w1,
        actin_w3,
        lectin_w2,
        tubulin_w2,
        ph3_w3,
        ph3_w4,
        edu_w2,
        calnexin_w4,
        gm130w4,
        controlplate,
        cell_lines,
        timepoint,
        magnification,
        cp_version,
        human_readable_name,
        experiment_date,
        ixmw1,
        ixmw2,
        ixmw3,
        ixmw4,
        platemap_id: -1,
        platemap_name: plate_map_file,
    }
    return result;
}

const update_progress_info = (token, progress_info) => {
    client.set(token, JSON.stringify(progress_info));
}

const cache = {}
let cache_experiment_hit = 0;
let cache_experiment_miss = 0;

const get_cache_hit_rate = () => {
    const total = cache_experiment_hit + cache_experiment_miss
    if (total == 0) {
        return 0.0;
    }
    else {
        return cache_experiment_hit / total * 100.0;
    }
}


export const process_crc_csv = async (csv_file: Express.Multer.File, token: string) => {
    const progress_info = { is_finished: false, crc_progress_info: {} };
    update_progress_info(token, progress_info);


    const file = csv_file;
    const rows = (await csv({ flatKeys: true }).fromFile(file.path))
        .map(reshape_keys)

    const row_total = rows.length;
    let row_count = 0;
    let row_percent = 0.0;
    const name = csv_file.originalname;
    const crc_progress_info = {
        name,
        row_total,
        row_count,
        row_percent,
        cache_experiment_hit,
        cache_experiment_miss,
        cache_experiment_hit_rate: get_cache_hit_rate()
    };

    const p_list = rows.map(build_experiment)
        .map(async (experiment) => {
            // get platemap id
            let platemap_db = await platemap_controller.Model
                .findOne({
                    where: { name: experiment.platemap_name + '.csv' },
                    attributes: ['id', 'name']
                })
                .catch(error => console.log(`error - platemap controller findall: ${error}`));

            if (!falsy(platemap_db)) {
                experiment.platemap_id = platemap_db.id;
                const experiment_id = await create_experiment_db(experiment);
            }
            else {
                console.log(`no platemap ${experiment.platemap_name} found for experiment: ${experiment.human_readable_name}`);
            }


            crc_progress_info.cache_experiment_hit = cache_experiment_hit;
            crc_progress_info.cache_experiment_miss = cache_experiment_miss;
            crc_progress_info.cache_experiment_hit_rate = get_cache_hit_rate();

            row_count += 1;
            row_percent = parseFloat(((row_count * 100.0) / row_total).toFixed(1));
            crc_progress_info.row_count = row_count;
            crc_progress_info.row_percent = row_percent;
            console.log(`${name} - ${row_count} of ${row_total} = ${row_percent}`);
            progress_info.crc_progress_info = crc_progress_info;
            if (row_count == row_total) { progress_info.is_finished = true; }

            update_progress_info(token, progress_info);
            return Promise.resolve();
        });
    all(p_list)
        .then(() => {
            console.log("finished")
            progress_info.is_finished = true;
            update_progress_info(token, progress_info);
        })
        .catch((err) => {
            console.log("crc upload: " + err);
        })
}



const create_experiment_db = async (experiment: Experiment) => {
    if (!(experiment.human_readable_name in cache)) {
        // check db
        let experiment_db = await experiment_controller.Model
            .findOne({ where: { human_readable_name: experiment.human_readable_name }, attributes: ['id', 'human_readable_name'] })
            .catch(error => console.log(`error - experiment controller findall: ${error}`));

        if (!falsy(experiment_db)) {
            cache[experiment_db.human_readable_name] = experiment_db.id;
        }
        else {
            delete experiment.platemap_name;
            experiment_db = await experiment_controller.insert(experiment)
                .catch(error => console.log(`error - experiment controller insert: ${error}`));
            cache[experiment_db.human_readable_name] = experiment_db.id;
        }
    }
    return cache[experiment.human_readable_name];
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
