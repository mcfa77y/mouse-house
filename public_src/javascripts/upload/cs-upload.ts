import Axios from 'axios';
const { falsy: isFalsey } = require('is_js');
import * as Toastr from 'toastr';

import { form_ids_vals } from '../cs-form-helper';
import { set_custom_file_label, Poll_Request } from '../cs-model-common';



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
        const progress = ({data})=>{
            // Toastr.info(JSON.stringify(data, null, 2));
            if(data.progress.is_finish){
                pr.disablePoll();
                return;
            }
            $('#progress_info').html(`<pre>${JSON.stringify(data.progress, null, 2)}</pre>`);
        }
        Toastr.info(response.data);
        const {token} = response.data;
        const pr_config = {
            url: "/upload/progress",
            data: {token},
            success_cb: progress,
            fail_cb: error,
            config: {}
        }
        const pr = new Poll_Request(pr_config);
         
        pr.activatePoll();
    }
    
    const submit_button = $('#submit');
    const platemap_file_input: HTMLInputElement = <HTMLInputElement>document.querySelector('#platemap_csv_files');
    const crc_file_input: HTMLInputElement = <HTMLInputElement>document.querySelector('#crc_csv');
    const image_zip_file_input: HTMLInputElement = <HTMLInputElement>document.querySelector('#images_zip');
    
    submit_button.click((e) => {
        e.preventDefault();

        const dt = form_ids_vals('upload-fields');
        
        Array.from(platemap_file_input.files).forEach((file) => {
            dt.append('platemap_csv_files', file);
        });

        dt.append('crc_csv', crc_file_input.files[0]);
        // dt.append('crc_csv_label', document.getElementById('crc_csv_label').innerText);

        dt.append('images_zip', image_zip_file_input.files[0]);
        // dt.append('images_zip_label', document.getElementById('images_zip_label').innerText);
        
        // const config = {
            
        //   };
        
          Axios.post('/upload', dt)
            .then(success)
            .catch(error);

    });

    $('#crc_csv').change(() => {
        // get the file name
        const value = crc_file_input.files[0].name;
        // replace the "Choose a file" label
        set_custom_file_label('crc_csv', value);
    });

    $('#images_zip').change(() => {
        // get the file name
        const value = image_zip_file_input.files[0].name;
        // replace the "Choose a file" label
        set_custom_file_label('images_zip', value);
    });

    $('#platemap_csv_files').change(() => {
        // get the file name
        const value = `${platemap_file_input.files.length} platemap files selected`;
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
