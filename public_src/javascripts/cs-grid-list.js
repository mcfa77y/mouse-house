import * as Axios from 'axios';
import { form_ids_vals } from './cs-form-helper';

const zeroFill = require('zero-fill');


$(() => {
    const submit_button = $('#submit');
    const results = $('#results');
    const model_name = 'grid';

    const error = (data) => {
        results.html(`error: ${data.error_message}`);
    };


    const create_card = (response) => {
        $('#image-row').append(`${response.data.html}`);
    };

    $(document).on('click', '.hover_cell', (event) => {
        const clickedElement = $(event.target);
        const targetElement = clickedElement.closest('.hover_cell');
        const index = zeroFill(3, targetElement.text());
        const dt = $.extend(form_ids_vals(`${model_name}-fields`), { index });
        Axios.post(`/${model_name}/card`, dt)
            .then(create_card)
            .catch(error);

        // $(`#image_${index}`).toggleClass('d-none');
    });

    $(document).on('click', '.close-btn', function () {
        $(this).closest('.card').fadeOut();
    });

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
        $('#collapseOne').collapse();
        $('#collapseTwo').collapse('show');
        const dt = form_ids_vals(`${model_name}-fields`);
        Axios.post(`/${model_name}/table`, dt)
            .then(create_table)
            .catch(error);
    });
});
