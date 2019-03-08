const csv = require('csvtojson');
const BlueBird = require('bluebird');

const stat = BlueBird.promisify(require('fs').stat);

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

const one_d_2_two_d = (index, well_row_count) => {
    const i = parseInt(index, 10) - 1;
    const col = i % well_row_count;
    const row = Math.floor((i - col) / well_row_count);
    return { row, col };
};

const find_row_by_index = (index, data) => {
    const well_row_count = 24;
    const { row, col } = one_d_2_two_d(index, well_row_count);
    return find_row_by_well(col + 1, row + 1, data);
};

const file_exist = (uri, error_msg) => stat(uri)
    .catch(error => Promise.reject(new Error(error_msg)));

module.exports = {
    create_data_from_csv,
    find_row_by_column,
    find_row_by_well,
    one_d_2_two_d,
    find_row_by_index,
    file_exist,
};

