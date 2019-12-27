import * as Axios from 'axios';
import isFalsey from 'falsey';

import { form_ids_vals } from './cs-form-helper';
import { GRID_MODE, error } from './cs-grid-utils';
import { setup_tag } from './cs-grid-tag';
import { setup_grid_cells, set_grid_mode } from './cs-grid-cell';
import { setup_cards } from './cs-grid-cards';

const set_custom_file_label = (id, value) => {
    $(`#${id}`).next('.custom-file-label').html(value);
};
const data_the_table = () => {
    const table_options = {
        scrollX: true,
        paging: false,
    };
    $('#grid_table').DataTable(table_options);
};

const setup_form = () => {
    const results = $('#results');

    const create_table = (response) => {
        $('#results_spinner').collapse('hide');
        results.html(`${response.data.html}`);
        $('#results_title').text(response.data.config_name_description);
        const table_options = {
            scrollX: true,
            paging: false,
        };
        $('#grid_table').DataTable(table_options);
        if (response.data.tags !== undefined) {
            response.data.tags.forEach(({ row_col, tag }) => {
                $(`td[value="${row_col}"]`).removeClass('unselected_cell');
                $(`td[value="${row_col}"]`).addClass(tag);
            });
        }
    };

    const submit_button = $('#submit');
    submit_button.click((e) => {
        e.preventDefault();
        $('#configModal').modal('hide');
        $('#results_spinner').collapse('show');

        const dt = form_ids_vals('grid-fields');
        Array.from(document.getElementById('image_files').files).forEach((file) => {
            dt.append('image_files', file);
        });
        dt.append('metadata_csv', document.getElementById('metadata_csv').files[0]);
        dt.append('grid_data_csv', document.getElementById('grid_data_csv').files[0]);
        dt.append('metadata_csv_label', document.getElementById('metadata_csv_label').innerText);
        dt.append('grid_data_csv_label', document.getElementById('grid_data_csv_label').innerText);

        Axios.post('/grid/table', dt)
            .then(create_table)
            .catch(error);
    });

    $('#grid_data_csv').change(() => {
        // get the file name
        const value = document.getElementById('grid_data_csv').files[0].name;
        // replace the "Choose a file" label
        set_custom_file_label('grid_data_csv', value);
    });

    $('#metadata_csv').change(() => {
        // get the file name
        const value = document.getElementById('metadata_csv').files[0].name;
        // replace the "Choose a file" label
        set_custom_file_label('metadata_csv', value);
    });

    $('#image_files').change(() => {
        // get the file name
        const value = `${document.getElementById('image_files').files.length} files selected`;
        // replace the "Choose a file" label
        set_custom_file_label('image_files', value);
    });
};


const setup_upload_config_form = () => {
    const update_config_select = (res) => {
        const x = $('#config_name').selectize();
        const y = x[0].selectize;
        Object.keys(res.data.config_map).forEach((select_item) => {
            y.addOption({ value: select_item, text: select_item });
            y.refreshOptions();
        });
        $('#uploadModal').modal('hide');
        $('#configModal').modal('show');
    };

    const submit_button = $('#submit_upload');
    submit_button.click((e) => {
        e.preventDefault();

        // $('#collapseTwo').collapse('show');
        const formData = new FormData();
        formData.append('config_file', document.getElementById('config_file').files[0]);
        Axios.post('/grid/config', formData)
            .then(update_config_select)
            .catch(error);
    });

    $('#config_file').change(() => {
        // get the file name
        const value = document.getElementById('config_file').files[0].name;
        // replace the "Choose a file" label
        set_custom_file_label('config_file', value);
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
    set_custom_file_label('image_files', `${image_count} files selected`);
    // clear files from last use
    document.getElementById('image_files').value = '';
};

const setup_selects = () => {
    $('.foo-select')
        .toArray()
        .forEach((s) => {
            $(s).selectize({
                plugins: ['restore_on_backspace', 'remove_button'],
                create: true,
                persist: true,
                maxItems: 1,
            });
        });

    $('#config_name').change(() => {
        const dt = form_ids_vals('grid-fields');
        if (dt.get('config_name_description') !== '') {
            Axios.get(`/grid/config/${dt.get('config_name_description')}`)
                .then(update_form)
                .catch(error);
        }
    });
};


$(() => {
    set_grid_mode(GRID_MODE.CREATE_CARD);
    setup_selects();
    setup_form();
    setup_upload_config_form();
    setup_grid_cells();
    setup_cards();
    setup_tag();
    if (window.location.pathname === '/grid') {
        $('#configModal').modal('show');
    } else {
        data_the_table();
        const config_name_description = window.location.pathname.split('/')[2];
        Axios.get(`/grid/config/${config_name_description}`)
            .then(update_form)
            .catch(error);
        const x = $('#config_name').selectize();
        const y = x[0].selectize;
        y.setValue(config_name_description);
    }
});
