const csv = require('csvtojson');
const BlueBird = require('bluebird');
const zeroFill = require('zero-fill');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

const stat = BlueBird.promisify(fs.stat);

const WELL_ROW_COUNT = 24;

const create_data_from_csv = async csv_uri => csv({ flatKeys: true })
    .fromFile(csv_uri)
    .then((data) => {
        const column_headers = Object.keys(data[0]);
        const row_value_list = data
            .reduce((acc_array, row) => {
                acc_array.push(Object.values(row));
                return acc_array;
            }, []);
        return {
            column_headers, row_value_list,
        };
    });

const find_row_by_column = (col_name, test, data) => {
    const {
        column_headers, row_value_list,
    } = data;
    const col_index = column_headers.indexOf(col_name);
    return {
        column_headers,
        row_value_list: row_value_list.filter(row => test(row[col_index])),
    };
};

const find_row_by_well = (well_x, well_y, data) => {
    const x_data = find_row_by_column('Well X', value => parseInt(value, 10) === parseInt(well_x, 10), data);
    return find_row_by_column('Well Y', value => parseInt(value, 10) === parseInt(well_y, 10), x_data);
};

const one_d_2_two_d = (index) => {
    const i = parseInt(index, 10) - 1;
    const col = i % WELL_ROW_COUNT;
    const row = Math.floor((i - col) / WELL_ROW_COUNT);
    return { row, col };
};

const two_d_2_one_d = (index) => {
    const [row, col] = index.split('_').map(x => parseInt(x, 10));
    return WELL_ROW_COUNT * row + col;
};

const find_row_by_index = (index, data) => {
    const [row, col] = index.split('_').map(x => parseInt(x, 10));
    return find_row_by_well(col, row + 1, data);
};

const file_exist = (uri, error_msg) => stat(uri)
    .catch(error => Promise.reject(new Error(error_msg)));

const create_cell_name = (meta_headers, meta_row) => {
    const molarity_index = meta_headers.indexOf('Molarity (mM)');
    let molarity = 'molarity_unknown';
    if (molarity_index !== -1) {
        molarity = zeroFill(2, meta_row[molarity_index]);
    }
    const molecule_index = meta_headers.indexOf('Molecule Name');
    let molecule_name = 'molecule_unknown';
    if (molecule_index !== -1) {
        molecule_name = meta_row[molecule_index];
    }
    return `${molecule_name}_${molarity}`;
};

const synthesize_rows = (other_row_value_list, meta_row_list, meta_headers) => other_row_value_list
    .map((other_row_value, row_index) => other_row_value.map((other_value, col_index) => {
        let new_cell_name = other_value;
        if (col_index !== 0) {
            const { row_value_list: meta_row } = find_row_by_index(`${row_index}_${col_index}`, { column_headers: meta_headers, row_value_list: meta_row_list });
            new_cell_name = create_cell_name(meta_headers, meta_row[0]);
        }
        return new_cell_name;
    }));


const sanitize_config_name = name => name.trim().replace(' ', '_');

const save_config_to_disk = (config, config_dir) => {
    const date_suffix = moment().format('YYYY_MM_DD');
    const config_filename = path.join(config_dir, `config_map_${date_suffix}.json`);
    fs.writeFileSync(config_filename, JSON.stringify(config, null, 2));
};

const add_config = (req) => {
    let config_map = {};
    if (req.session.config_map) {
        ({ config_map } = req.session);
    }

    const {
        config_name_description,
        tags,
        metadata_csv_label,
        grid_data_csv_label,
    } = req.body;
    const {
        grid_data_csv,
        metadata_csv,
        image_files,
    } = req.files;
    const config = config_map[sanitize_config_name(config_name_description)] || {};
    if (image_files === undefined) {
        config.image_file_uri_list = config.image_file_uri_list;
    } else {
        config.image_file_uri_list = image_files.map((x) => {
            const uri = x.path;
            if (uri.indexOf('/experiments') !== -1) {
                return uri.slice(uri.indexOf('/experiments'));
            }
            return uri;
        });
    }
    if (grid_data_csv === undefined) {
        config.grid_data_csv_uri = grid_data_csv_label;
    } else {
        config.grid_data_csv_uri = grid_data_csv[0].path;
    }
    if (metadata_csv === undefined) {
        config.metadata_csv_uri = metadata_csv_label;
    } else {
        config.metadata_csv_uri = metadata_csv[0].path;
    }
    if (tags !== undefined) {
        config.tags = tags.map(tag => JSON.parse(tag));
    }
    config_map[sanitize_config_name(config_name_description)] = config;
    req.session.config_map = Object.assign({}, config_map);

    return req.session.config_map;
};

const get_config = (req, config_name) => {
    let config_map = {};
    if (req.session.config_map) {
        ({ config_map } = req.session);
    }
    return config_map[sanitize_config_name(config_name)];
};

module.exports = {
    create_data_from_csv,
    find_row_by_column,
    find_row_by_well,
    one_d_2_two_d,
    two_d_2_one_d,
    find_row_by_index,
    file_exist,
    synthesize_rows,
    create_cell_name,
    sanitize_config_name,
    add_config,
    get_config,
    save_config_to_disk,
};

