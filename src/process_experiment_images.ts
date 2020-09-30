import path from 'path';

import { promises as fsPromises } from 'fs';
import Bluebird, { Promise as BlueBirdPromise } from 'bluebird';
import glob from 'glob';

const glob_promise: (arg1: string) => Bluebird<string[]> = BlueBirdPromise.promisify(glob);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const EXPIRIMENT_DIR = path.join(PUBLIC_DIR, 'experiments');

const asyncFilter = async (arr: string[], predicate): Promise<string[]> => {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
};

const get_experiment_name_from_path = (uri: string): string => path.parse(uri).dir.split('/').slice(-1)[0].toLocaleLowerCase();

export const parseHrtimeToSeconds = (hrtime, msg) => {
    const seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
    console.log(`${seconds} (s)\t${msg}`);
    return seconds;
};

export const get_child_dirs = async (dir): Promise<string[]> => {
    const files = await fsPromises.readdir(dir);
    return (await asyncFilter(files, async (filename) => {
        const file = path.join(dir, filename);
        return (await fsPromises.stat(file)).isDirectory();
    }))
        .map((filename) => path.join(dir, filename));
};

export const rm_expr_img_meta = async () => {
    const expr_uri_list = await get_child_dirs(EXPIRIMENT_DIR);
    const rm_promise_list = (await asyncFilter(expr_uri_list,
        async (expr_uri) => {
            // dirs with image_metadata.json have been processed
            const x = await glob_promise(`${expr_uri}/image_metadata.json`);
            return x.length > 0;
        }))
        .map(async (expr_uri) => {
            const image_metadata_json_uri: string = (await glob_promise(`${expr_uri}/image_metadata.json`))[0];
            const expr_name = get_experiment_name_from_path(image_metadata_json_uri);
            console.log(`removing image metadata:\t${expr_name}`);
            // console.log(`removing image_metadata_json_uri: ${image_metadata_json_uri}`);

            return fsPromises.unlink(image_metadata_json_uri);
        });
    return Promise.all(rm_promise_list);
};

export const expr_img_meta_to_json_map = async () => {
    const expr_uri_list = await get_child_dirs(EXPIRIMENT_DIR);
    // dirs with image_metadata.json have been processed
    const foo_list = (await asyncFilter(expr_uri_list,
        async (expr_uri) => (await glob_promise(`${expr_uri}/image_metadata.json`)).length > 0));

    const promise_bar_list = foo_list.map((expr_uri) => glob_promise(`${expr_uri}/image_metadata.json`));
    const bar_list = await Promise.all(promise_bar_list);

    return bar_list.reduce((acc, image_metadata_json_uri_list) => {
        const image_metadata_json_uri = image_metadata_json_uri_list[0];
        // image_metadata_json_uri = image_metadata_json_uri.substring(image_metadata_json_uri.indexOf('public'));
        const experiment_name = get_experiment_name_from_path(image_metadata_json_uri);
        acc[experiment_name] = image_metadata_json_uri;
        return acc;
    }, {});
};

export const update_image_metadata = async (dir, pretty_print = false) => {
    // get top level expr
    let startTime;
    const expr_uri_list = await get_child_dirs(dir);

    const write_file_promise_list = (await asyncFilter(expr_uri_list,
        async (expr_uri) => {
            // skip expr that have already been proccessed
            // dirs with image_metadata.json have been processed
            // console.log(`expr_uri: ${expr_uri}`);
            const expr_name = expr_uri.split('/').slice(-1)[0].toLocaleLowerCase();
            // startTime = process.hrtime();
            const json_file_list = await glob_promise(`${expr_uri}/image_metadata.json`);
            const is_write_image_metadata = json_file_list.length === 0;
            // parseHrtimeToSeconds(process.hrtime(startTime), `update_0 - found image_metadata.json: ${!is_write_image_metadata} \t expr: ${expr_name}`);

            return is_write_image_metadata;
        }))
        .map(async (expr_uri) => {
            const expr_name_2 = expr_uri.split('/').slice(-1)[0].toLocaleLowerCase();
            // process expr
            startTime = process.hrtime();
            const img_uri_list = await glob_promise(`${expr_uri}/**/*.jpg`);
            parseHrtimeToSeconds(process.hrtime(startTime), `update_1 - find **.jpg \t\t\t\t expr: ${expr_name_2} \t size: ${img_uri_list.length}`);

            startTime = process.hrtime();

            let expr_name = '';
            const image_metadata = img_uri_list
                .reduce((acc2, img_uri) => {
                    // ex file name for image
                    // 190905-RAW-SP0136-Cyto-20x_A01_s1_w1_nuclei
                    let [human_readable_name, cell, sector, wavelength, feature] = path.parse(img_uri).name.split('_');
                    if (acc2[cell] === undefined) {
                        acc2[cell] = [];
                    }
                    const sector_index = parseInt(sector.substr(1), 10) - 1;
                    const wavelength_index = parseInt(wavelength.substr(1, 1), 10);
                    let stain = '';
                    let lps_status = '';
                    human_readable_name = human_readable_name.toLocaleLowerCase();
                    expr_name = human_readable_name;
                    if (human_readable_name.includes('edu')) {
                        stain = 'edu';
                    } else if (human_readable_name.includes('cyto') || human_readable_name.includes('cyto2')) {
                        stain = 'cyto';
                    }
                    if (human_readable_name.includes('lps')) {
                        lps_status = 'lps_plus';
                    } else {
                        lps_status = 'lps_minus';
                    }
                    if (feature === 'composite') {
                        wavelength = 'overlay';
                    }
                    const uri = img_uri.substring(img_uri.indexOf('experiment'));
                    acc2[cell].push({
                        uri,
                        feature,
                        wavelength: wavelength_index,
                        sector: sector_index,
                        stain,
                        lps_status,
                    });
                    return acc2;
                }, { experiment_name: '' });

            // const expr_name = path.parse(expr_uri).name.toLocaleLowerCase();
            image_metadata.experiment_name = expr_name;
            // write metadata to file

            let metadata_string = '';
            if (pretty_print) {
                metadata_string = JSON.stringify(image_metadata, null, 1);
            } else {
                metadata_string = JSON.stringify(image_metadata);
            }
            const output_uri = path.join(expr_uri, 'image_metadata.json');
            parseHrtimeToSeconds(process.hrtime(startTime), `update_2 - writing image_metadata.json \t\t expr: ${expr_name}`);
            return fsPromises.writeFile(output_uri, metadata_string);
        });

    return Promise.all(write_file_promise_list);
};
// rm_expr_img_meta();
// update_image_metadata(EXPIRIMENT_DIR, true);
// const foo = expr_img_meta_to_json_map();
// Object.keys(foo)
//     .forEach((key) => {
//         console.log(key + ": " + foo[key]);

//     });
