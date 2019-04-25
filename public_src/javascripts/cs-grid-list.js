import * as Axios from 'axios';
import { form_ids_vals } from './cs-form-helper';

const foo_this = (event, klass) => {
    const clickedElement = $(event.target);
    const targetElement = clickedElement.closest(klass);
    return targetElement;
};

const setup_grid_cells = () => {
    const results = $('#results');

    const error = ({ response }) => {
        results.html(`error: ${response.data.message}`);
    };
    const create_card = (response) => {
        $('#image_row').append(`${response.data.html}`);
    };

    $(document).on('click', '.hover_cell', (event) => {
        const targetElement = foo_this(event, '.hover_cell');
        const index = targetElement[0].attributes.value.value;
        const dt = $.extend(form_ids_vals('grid-fields'), { index });
        Axios.post('/grid/card', dt)
            .then(create_card)
            .catch(error);

    // $(`#image_${index}`).toggleClass('d-none');
    });
};

const setup_cards = () => {
    $(document).on('click', '.close-btn', (event) => {
        const targetElement = foo_this(event, '.close-btn');
        targetElement.closest('.card').fadeOut({ complete() { $(this).remove(); } });
    });
    $(document).on('click', '.card-img-top', (event) => {
        const targetElement = foo_this(event, '.card-img-top');
        const img_uri = targetElement.closest('.card-img-top').attr('src');
        window.open(img_uri, 'Image');
    });
};

const setup_form = () => {
    const results = $('#results');

    const error = ({ response }) => {
        const warning = `<div class="alert alert-warning" role="alert">${response.data.message}</div>`;
        results.html(warning);
    };

    const create_table = (response) => {
        results.html(`${response.data.html}`);
        const table_options = {
            scrollX: true,
            paging: false,
        };
        $('#grid-list').DataTable(table_options);
    };

    const submit_button = $('#submit');
    submit_button.click((e) => {
        e.preventDefault();
        $('#configModal').modal('hide');
        // $('#collapseTwo').collapse('show');

        const dt = form_ids_vals('grid-fields');
        Axios.post('/grid/table', dt)
            .then(create_table)
            .catch(error);
    });
};


const setup_upload_config_form = () => {
    const results = $('#results');

    const error = ({ response }) => {
        const warning = `<div class="alert alert-warning" role="alert">${response.data.message}</div>`;
        results.html(warning);
    };

    const update_config_select = (res) => {
        const x = $('#config_name').selectize();
        const y = x[0].selectize;
        Object.keys(res.data.config_map).forEach((select_item) => {
            y.addOption({ value: select_item, text: select_item });
            y.refreshOptions();
        });
    };

    const submit_button = $('#submit_upload');
    submit_button.click((e) => {
        e.preventDefault();
        $('#uploadModal').modal('hide');
        $('#configModal').modal('show');
        // $('#collapseTwo').collapse('show');
        const formData = new FormData();
        formData.append('config_file', document.getElementById('config_file').files[0]);
        Axios.post('/grid/config', formData)
            .then(update_config_select)
            .catch(error);
    });

    $('#config_file').change((e) => {
        // get the file name
        const fileName = document.getElementById('config_file').files[0].name;
        // replace the "Choose a file" label
        $('#config_file').next('.custom-file-label').html(fileName);
    });
};

const setupSelects = () => {
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
    const update_form = (res) => {
        console.log(JSON.stringify(res.data.config, null, 2));
        const {
            csv_uri, image_dir_uri, prefix, extension, metadata_csv_uri,
        } = res.data.config;
        $('#csv_uri').val(csv_uri);
        $('#image_dir_uri').val(image_dir_uri);
        $('#prefix').val(prefix);
        $('#extension').val(extension);
        $('#metadata_csv_uri').val(metadata_csv_uri);
    };
    const results = $('#results');
    const error = ({ response }) => {
        const warning = `<div class="alert alert-warning" role="alert">${response.data.message}</div>`;
        results.html(warning);
    };
    $('#config_name').change(() => {
        const dt = form_ids_vals('grid-fields');
        Axios.get(`/grid/config/${dt.config_name}`)
            .then(update_form)
            .catch(error);
    });
};

$(() => {
    setupSelects();
    setup_form();
    setup_upload_config_form();
    setup_grid_cells();
    setup_cards();
    $('#configModal').modal('show');
});
