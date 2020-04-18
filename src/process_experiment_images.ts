import path from "path";
import { statSync, readdirSync, writeFileSync, unlinkSync } from "fs";

const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const EXPIRIMENT_DIR = path.join(PUBLIC_DIR, 'experiments');

export const getAllFiles = (dir, extn): string[] => {
    let files = readdirSync(dir);
    let result = [];
    let regex = new RegExp(`\\${extn}$`)
    return getAllFiles_helper(dir, extn, files, result, regex);
}
export const getAllFiles_helper = (dir, extn, files, result, regex): string[] => {
    files = files || readdirSync(dir);
    // result = result || [];
    // regex = regex || new RegExp(`\\${extn}$`)

    for (let i = 0; i < files.length; i++) {
        let file = path.join(dir, files[i]);
        if (statSync(file).isDirectory()) {
            try {
                result = getAllFiles_helper(file, extn, readdirSync(file), result, regex);
            } catch (error) {
                continue;
            }
        } else {
            if (regex.test(file)) {
                result.push(file);
            }
        }
    }
    return result;
}
export const get_child_dirs = (dir): string[] => {
    const files = readdirSync(dir);
    return files.filter((filename) => {
        let file = path.join(dir, filename);
        return statSync(file).isDirectory();
    })
        .map((filename) => {
            return path.join(dir, filename)
        });

}

export const get_child_files = (dir, extn): string[] => {
    const files = readdirSync(dir);
    let regex = new RegExp(`\\${extn}$`)
    return files.filter((filename) => {
        let file = path.join(dir, filename);
        return !statSync(file).isDirectory() && regex.test(file);
    })
        .map((filename) => {
            return path.join(dir, filename)
        })
}
// const img_uri_list = getAllFiles(EXPIRIMENT_DIR, '.jpeg')
// const img_metadata_uri_list = getAllFiles(EXPIRIMENT_DIR, 'image_metadata.json')

// structure of image metadata
const wave = {
    overlay: [],
    w1: [],
    w2: [],
    w3: [],
    w4: [],
}

export const rm_expr_img_meta = () => {
    const expr_uri_list = get_child_dirs(EXPIRIMENT_DIR);
    expr_uri_list
        .filter((expr_uri) => {
            // dirs with image_metadata.json have been processed
            return get_child_files(expr_uri, '.json').length > 0
        })
        .forEach((expr_uri) => {
            const image_metadata_json_uri = get_child_files(expr_uri, '.json')[0]
            console.log('removing image metadata:' + expr_uri);

            unlinkSync(image_metadata_json_uri)
        });

}

export const expr_img_meta_to_json_map = () => {
    const expr_uri_list = get_child_dirs(EXPIRIMENT_DIR);
    return expr_uri_list
        .filter((expr_uri) => {
            // dirs with image_metadata.json have been processed
            return get_child_files(expr_uri, '.json').length > 0
        })
        .reduce((acc, expr_uri) => {
            let image_metadata_json_uri = get_child_files(expr_uri, '.json')[0]
            // image_metadata_json_uri = image_metadata_json_uri.substring(image_metadata_json_uri.indexOf('public'));
            let experiment_name = path.parse(expr_uri).name.toLocaleLowerCase();
            acc[experiment_name] = image_metadata_json_uri;
            return acc;
        }, {});

}

export const update_image_metadata = (dir, pretty_print = false) => {
    // get top level expr
    const expr_uri_list = get_child_dirs(dir);
    expr_uri_list
        .filter((expr_uri) => {
            // skip expr that have already been proccessed
            // dirs with image_metadata.json have been processed
            return get_child_files(expr_uri, '.json').length == 0
        })
        .forEach((expr_uri) => {
            // process expr 
            const img_uri_list = getAllFiles(expr_uri, '.jpg')
            const image_metadata = img_uri_list
                .reduce((acc2, img_uri) => {
                    // ex file name for image
                    // 190905-RAW-SP0136-Cyto-20x_A01_s1_w1_nuclei
                    let [human_readable_name, cell, sector, wavelength, feature] = path.parse(img_uri).name.split('_');
                    if (acc2[cell] == undefined) {
                        acc2[cell] = [];
                    }
                    const sector_index = parseInt(sector.substr(1)) - 1;
                    const wavelength_index = parseInt(wavelength.substr(1));
                    let stain = '';
                    let lps_status = '';
                    human_readable_name = human_readable_name.toLocaleLowerCase();
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
                    if (feature == 'composite') {
                        wavelength = 'overlay';
                    }
                    const uri = img_uri.substring(img_uri.indexOf('experiment'));
                    acc2[cell].push({
                        uri,
                        feature,
                        wavelength: wavelength_index,
                        sector: sector_index,
                        stain,
                        lps_status
                    });
                    return acc2;
                }, { experiment_name: '' });
            const expr_name = path.parse(expr_uri).name.toLocaleLowerCase();
            image_metadata.experiment_name = expr_name;
            // write metadata to file
            console.log('writing image metadata for experiment: ' + expr_name);
            let metadata_string = "";
            if (pretty_print) {
                metadata_string = JSON.stringify(image_metadata, null, 1);
            } else {
                metadata_string = JSON.stringify(image_metadata);
            }
            const output_uri = path.join(expr_uri, 'image_metadata.json');
            writeFileSync(output_uri, metadata_string);
        });
}
// rm_expr_img_meta();
// update_image_metadata(EXPIRIMENT_DIR, true);
// const foo = expr_img_meta_to_json_map();
// Object.keys(foo)
//     .forEach((key) => {
//         console.log(key + ": " + foo[key]);

//     });