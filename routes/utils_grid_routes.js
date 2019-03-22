const csv = require('csvtojson');
const BlueBird = require('bluebird');
const zeroFill = require('zero-fill');

const stat = BlueBird.promisify(require('fs').stat);

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


const synthesize_rows = (other_row_value_list, meta_row_list, meta_headers) => {
    const molarity_index = meta_headers.indexOf('Molarity (mM)');
    const molecule_index = meta_headers.indexOf('Molecule Name');
    return other_row_value_list
        .map((other_row_value, row_index) => other_row_value.map((other_value, col_index) => {
            let new_cell_name = other_value;
            if (col_index !== 0) {
                const { row_value_list: meta_row } = find_row_by_index(`${row_index}_${col_index}`, { column_headers: meta_headers, row_value_list: meta_row_list });
                new_cell_name = `${zeroFill(2, meta_row[0][molarity_index])}_${meta_row[0][molecule_index]}`;
            }
            return new_cell_name;
        }));
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
};

