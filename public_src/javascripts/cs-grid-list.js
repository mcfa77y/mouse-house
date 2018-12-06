import { form_ids_vals } from './cs-form-helper';
import * as Axios from 'axios';

$(() => {
    const submit_button = $('#submit');
    const results = $('#results');
    const model_name = 'grid';

    const success = (data) => {
        console.log(data);
        results.html(`${data.data.html}`);
        const table_options = {
            select: { style: 'multi' },
            responsive: true,
            dom: 'lBfrti',
            
            scrollY: '500px',
            scrollCollapse: true,
            paging: false,
            info: false,

            lengthMenu: [
                [5, 10, 25, -1],
                [5, 10, 25, 'All'],
            ],
            initComplete() {
                this.api().columns.adjust();
            },
        };


        const table = $(`#${model_name}-list`).DataTable();
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
