import { form_ids_vals } from './cs-form-helper';
import * as Axios from 'axios';

$(() => {
    const submit_button = $('#submit');
    const results = $('#results');
    const model_name = 'grid';

    const success = (data) => {
        console.log(data);
        results.html(`${data.data.html}`);
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
