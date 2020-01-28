import Axios from 'axios';
const { falsy: isFalsey } = require('is_js');
import * as Toastr from 'toastr';

import { form_ids_vals } from '../cs-form-helper';
import { set_custom_file_label } from '../cs-model-common';



const error = ({ response }) => {
    const results = $('#results');
    let warning = `<div class="alert alert-warning" role="alert">${JSON.stringify(arguments[0], null, 2)}</div>`;
    // let warning = `<div class="alert alert-warning" role="alert">${arguments[0])}</div>`;
    if (response !== undefined && response.data !== undefined && response.data.message !== undefined) {
        warning = `<div class="alert alert-warning" role="alert">${response.data.message}</div>`;
    }
    results.html(warning);
}

const setup_form = () => {
    const success = (response) => {
        toastr.info(response.data);
    }

    const submit_button = $('#submit');
    submit_button.click((e) => {
        e.preventDefault();
        $('#configModal').modal('hide');
        $('#results_spinner').collapse('show');

        const dt = form_ids_vals('upload-fields');
        Array.from(document.getElementById('platemap_csv_files').files).forEach((file) => {
            dt.append('platemap_csv_files', file);
        });
        dt.append('crc_csv', document.getElementById('crc_csv').files[0]);
        // dt.append('crc_csv_label', document.getElementById('crc_csv_label').innerText);

        dt.append('images_zip', document.getElementById('images_zip').files[0]);
        // dt.append('images_zip_label', document.getElementById('images_zip_label').innerText);

        Axios.post('/upload', dt)
            .then(success)
            .catch(error);
    });

    $('#crc_csv').change(() => {
        // get the file name
        const value = document.getElementById('crc_csv').files[0].name;
        // replace the "Choose a file" label
        set_custom_file_label('crc_csv', value);
    });

    $('#images_zip').change(() => {
        // get the file name
        const value = document.getElementById('images_zip').files[0].name;
        // replace the "Choose a file" label
        set_custom_file_label('images_zip', value);
    });

    $('#platemap_csv_files').change(() => {
        // get the file name
        const value = `${document.getElementById('platemap_csv_files').files.length} files selected`;
        // replace the "Choose a file" label
        set_custom_file_label('platemap_csv_files', value);
    });
};




const update_form = (res) => {
    if (isFalsey(res.data)) {
        return;
    }
    console.log(JSON.stringify(res.data.config, null, 2));
    const {
        grid_data_csv_uri, image_count, metadata_csv_uri,
    } = res.data.config;
    set_custom_file_label('grid_data_csv', grid_data_csv_uri);
    set_custom_file_label('metadata_csv', metadata_csv_uri);
    set_custom_file_label('platemap_csv_files', `${image_count} files selected`);
    // clear files from last use
    document.getElementById('platemap_csv_files').value = '';
};



$(() => {
    setup_form();
});
