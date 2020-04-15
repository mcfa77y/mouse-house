import csv from 'csvtojson';
import { falsy } from 'is_js';
import { all } from 'bluebird';

import experiment_controller from '../../controllers/experiment_controller';
import image_matadata_controller from '../../controllers/image_metadata_controller';
import { client } from './util_upload_common_routes';
import molecule from '../../database/models/molecule';
import { Op } from 'sequelize';

interface Image_Metadata {
    size: string,
    experiment_human_readable_name: string,
    molecule_cell: string,
    wavelength: string,
    sector: string,
    uri: string,
}

const build_image_metadata = (row): Image_Metadata => {
    const {
        size,
        experiment_name,
        cell,
        wavelength,
        sector,
        uri,
    } = row;
    // minus magnification -20x
    const human_readable_name = experiment_name.substring(0, experiment_name.length - 4);
    const result = {
        size,
        experiment_human_readable_name: human_readable_name,
        molecule_cell: cell,
        wavelength,
        sector,
        uri,
        molecule_id: -1,
        experiment_id: -1,
    }
    return result;
}

const update_progress_info = (token, progress_info) => {
    client.set(token, JSON.stringify(progress_info));
}

const cache = {}
let cache_hit = 0;
let cache_miss = 0;

const get_cache_hit_rate = () => {
    const total = cache_hit + cache_miss
    if (total == 0) {
        return 0.0;
    }
    else {
        return cache_hit / total * 100.0;
    }
}

const get_db_stuffs = async (human_readable_name: string) => {
    if (falsy(cache[human_readable_name])) {
        cache_miss += 1;
        const experiment_db = await experiment_controller.Model
            .findOne({
                where: {
                    human_readable_name: {
                        [Op.iLike]: human_readable_name
                    },
                },
                attributes: ['id', 'human_readable_name', 'platemap_id'],
            })
            .catch((error) => {
                console.log(`error - experiment controller findone: ${error}`);
                console.log('looking for: ' + human_readable_name);
            });
        const platemap_db = await experiment_db.getPlatemap()
            .catch((error) => {
                console.log(`error - experiment.platemap : ${error}`);
            });

        const molecule_db_list = await platemap_db.getMolecules({ attributes: ['id', 'cell'] })
            .catch((error) => {
                console.log(`error - platemap.molecules : ${error}`);
            });

        const molecule_cell_db_map = molecule_db_list.reduce((acc, molecule_db) => {
            acc[molecule_db.cell] = molecule_db
            return acc;
        }, {});

        cache[human_readable_name] = { experiment_db, molecule_cell_db_map };
    }
    else {
        cache_hit += 1;
    }
    return cache[human_readable_name];
}
const init_progress_info = (row_total, name) => {
    // const row_total = rows.length;
    let row_count = 0;
    let row_percent = 0.0;
    // const name = csv_file.originalname;
    return {
        name,
        row_total,
        row_count,
        row_percent,
        cache_hit: cache_hit,
        cache_miss: cache_miss,
        cache_hit_rate: get_cache_hit_rate(),
        start_time: new Date(),
        elapsed_time_hr: 0,
        rate: -1.0
    };
}

const update_x = (image_progress_info, progress_info, perChunk) => {
    image_progress_info.cache_hit = cache_hit;
    image_progress_info.cache_miss = cache_miss;
    image_progress_info.cache_hit_rate = get_cache_hit_rate();

    let curr_date = new Date();
    const delta_ms = (curr_date.getTime() - image_progress_info.start_time.getTime());
    image_progress_info.elapsed_time_hr = (delta_ms / (1000 * 3600)).toFixed(3)

    image_progress_info.rate = (image_progress_info.row_count / delta_ms * 1000).toFixed(3);

    let { row_count, row_percent, row_total } = image_progress_info;
    row_count += 1;
    row_percent = parseFloat(((row_count * 100.0) / row_total).toFixed(1));
    image_progress_info.row_count = row_count;
    image_progress_info.row_percent = row_percent;
    // if (row_count % perChunk == 0) {
    //     console.log(`\n\nimage_meta_data upload - ${row_count} of ${row_total} = ${row_percent}\n\n`);
    // }

    progress_info.image_progress_info = image_progress_info;
    if (row_count == row_total) {
        progress_info.is_finished = true;
    }
}

export const process_image_csv = async (csv_file: Express.Multer.File, token: string) => {
    const progress_info = { is_finished: false, image_progress_info: {} };
    update_progress_info(token, progress_info);

    const file = csv_file;
    // to do check if there is a header
    // size, experiment_name, cell, wavelength, sector, uri
    const rows = (await csv({ flatKeys: true }).fromFile(file.path))
        .map(reshape_keys)

    const image_progress_info = init_progress_info(rows.length, csv_file.originalname);
    const image_data_list = rows.map(build_image_metadata);
    // get set of expr names
    const experiment_name_list = image_data_list.reduce((acc, image_data) => {
        acc.add(image_data.experiment_human_readable_name)
        return acc;
    }, new Set<string>());
    // populate cache
    const db_stuffs_promise_list = Array
        .from(experiment_name_list)
        .map((experiment_name) => {
            return get_db_stuffs(experiment_name)
                .catch((err) => {
                    console.error("error populating cache");
                    console.error(err);
                });
        })
    await all(db_stuffs_promise_list)
        .catch((err) => {
            console.error("error populating cache - all");
            console.error(err);
        });
    const perChunk = 100;
    const chunk_image_data_list = image_data_list.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])
    const chunk_total = chunk_image_data_list.length * experiment_name_list.size;
    for (let chunk_index in chunk_image_data_list) {
        const img_data_list = chunk_image_data_list[chunk_index]
        const p_list = img_data_list.map((image_metadata) => {
            const {
                size,
                wavelength,
                sector,
                uri,
                molecule_cell: cell,
                experiment_human_readable_name: human_readable_name
            } = image_metadata;

            return get_db_stuffs(human_readable_name)
                .then(
                    ({ experiment_db, molecule_cell_db_map }) => {

                        const image_metadata_model = {
                            size,
                            wavelength: parseInt(wavelength[wavelength.length - 1]),
                            sector: parseInt(sector[sector.length - 1]),
                            uri,
                            experiment_id: experiment_db.id,
                            molecule_id: molecule_cell_db_map[cell].id
                        };

                        return image_matadata_controller.insert(image_metadata_model)
                            .then(() => {

                                update_x(image_progress_info, progress_info, perChunk);
                                if (image_progress_info.row_count % perChunk == 0 || image_progress_info.row_count == image_progress_info.row_total) {
                                    update_progress_info(token, progress_info);
                                }
                            })
                            .catch((err) => {
                                update_x(image_progress_info, progress_info, perChunk);
                                if (image_progress_info.row_count % perChunk == 0 || image_progress_info.row_count == image_progress_info.row_total) {
                                    update_progress_info(token, progress_info);
                                }
                            })
                    })
                .catch((err) => {
                    console.error("error get db stuffs: " + human_readable_name);
                    console.error(err);

                });

        });

        await all(p_list)
            .then(() => {
                console.log(`finished chunk - ${chunk_index + 1} / ${chunk_total}`)
                // progress_info.is_finished = true;
                update_progress_info(token, progress_info);
            })
            .catch((err) => {
                console.log("crc upload: " + err);
            })
    }


    // const p_list = image_data_list
    //     .map((image_metadata) => {
    //         const {
    //             size,
    //             wavelength,
    //             sector,
    //             uri,
    //             molecule_cell: cell,
    //             experiment_human_readable_name: human_readable_name
    //         } = image_metadata;

    //         return get_db_stuffs(human_readable_name).then(
    //             ({ experiment_db, molecule_cell_db_map }) => {

    //             const image_metadata_model = {
    //                 size,
    //                 wavelength: parseInt(wavelength[wavelength.length - 1]),
    //                 sector: parseInt(sector[sector.length - 1]),
    //                 uri,
    //                 experiment_id: experiment_db.id,
    //                 molecule_id: molecule_cell_db_map[cell].id
    //             };

    //             return image_matadata_controller.insert(image_metadata_model)
    //             .then(() => {

    //                 update_x(image_progress_info, progress_info);

    //                 update_progress_info(token, progress_info);
    //             })

    //             // return Promise.resolve();
    //         });

    //     });

    // all(p_list)
    //     .then(() => {
    //         console.log("finished")
    //         progress_info.is_finished = true;
    //         update_progress_info(token, progress_info);
    //     })
    //     .catch((err) => {
    //         console.log("crc upload: " + err);
    //     })
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
