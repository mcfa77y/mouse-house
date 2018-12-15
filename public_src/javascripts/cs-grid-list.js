import * as Axios from 'axios';
import { form_ids_vals } from './cs-form-helper';

const zeroFill = require('zero-fill');

const model_name = 'grid';
const foo_this = (event, klass) => {
    const clickedElement = $(event.target);
    const targetElement = clickedElement.closest(klass);
    return targetElement;
};

const setup_grid_cells = () => {
    const results = $('#results');
    const error = (data) => {
        results.html(`error: ${data.error_message}`);
    };
    const create_card = (response) => {
        $('#image_row').append(`${response.data.html}`);
    };

    $(document).on('click', '.hover_cell', (event) => {
        const targetElement = foo_this(event, '.hover_cell');
        const index = zeroFill(3, targetElement.text());
        const dt = $.extend(form_ids_vals(`${model_name}-fields`), { index });
        Axios.post(`/${model_name}/card`, dt)
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
    const submit_button = $('#submit');
    const results = $('#results');


    const error = (data) => {
        results.html(`error: ${data.error_message}`);
    };


    const create_table = (response) => {
        results.html(`${response.data.html}`);
        const table_options = {
            scrollX: true,
            paging: false,
        };
        $(`#${model_name}-list`).DataTable(table_options);
    };


    submit_button.click((e) => {
        e.preventDefault();
        $('#exampleModal').modal('hide');
        $('#collapseTwo').collapse('show');
        const dt = form_ids_vals(`${model_name}-fields`);
        Axios.post(`/${model_name}/table`, dt)
            .then(create_table)
            .catch(error);
    });
};

$(() => {
    setup_form();
    setup_grid_cells();
    setup_cards();
    $('#exampleModal').modal('show');
});
