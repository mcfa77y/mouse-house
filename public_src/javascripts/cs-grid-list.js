import { form_ids_vals } from './cs-form-helper';
import * as Axios from 'axios';

const zeroFill = require('zero-fill');

$(() => {
    const submit_button = $('#submit');
    const results = $('#results');
    const model_name = 'grid';

    const success = (response) => {
        results.html(`${response.data.html}`);
        $(`#${model_name}-list`).DataTable();
        $('.hover_cell').click((e) => {
            console.log(this);
            const index = zeroFill(3, this.textContent);
            console.log(`${'clicked: #image_'}${index}`);
            $(`#image_${index}`).toggleClass('d-none');
        });
    };
    const error = (data) => {
        results.html(`error: ${data.error_message}`);
    };

    submit_button.click((e) => {
        e.preventDefault();
        const dt = form_ids_vals(`${model_name}-fields`);
        Axios.post(`/${model_name}`, dt)
            .then(success)
            .catch(error);
    });
});
