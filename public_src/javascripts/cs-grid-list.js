import { form_ids_vals } from './cs-form-helper';
import * as Axios from 'axios';

const zeroFill = require('zero-fill');


$(() => {
    const submit_button = $('#submit');
    const results = $('#results');
    const model_name = 'grid';

    const error = (data) => {
        results.html(`error: ${data.error_message}`);
    };


    const create_card = (response) => {
        $('.card-deck').append(`${response.data.html}`);
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
        $(`#${model_name}-list`).DataTable();
    };


    submit_button.click((e) => {
        e.preventDefault();
        const dt = form_ids_vals(`${model_name}-fields`);
        Axios.post(`/${model_name}/table`, dt)
            .then(create_table)
            .catch(error);
    });
});
