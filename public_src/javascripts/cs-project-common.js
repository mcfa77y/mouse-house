import contains from 'underscore-es/contains';
import { setup_table } from './cs-model-common';
import { column_names as experiment_column_names, model_name as experiment_model_name } from './cs-experiment-common';

export const model_name = 'project';

export const column_names = ['id', 'id_alias', 'type',
    'end_date', 'experiments', 'notes',
];

export function setup_experiment_table() {
    const table = setup_table({ model_name: experiment_model_name, column_names: experiment_column_names, hide_id_column: true });

    const selected_experiments_input = $('#experiment_ids')[0].selectize;
    selected_experiments_input.disable();

    // const show_experiment_table_button = $('#show-experiment-table-button');
    $('#experiment-table').on('shown.bs.collapse', () => {
        table.columns.adjust();
        // table.columns.adjust()
        //     .responsive.recalc().draw();
    });
    $(document).on('shown.bs.modal', (e) => {
        console.log('\nshowN : ' + '\n');

        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    });
    $(document).on('show.bs.modal', (e) => {
        console.log('\nshow: ' + '\n');

        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    });

    const selected_ids = selected_experiments_input.getValue();

    table.rows((idx, data) => contains(selected_ids, `${data.id}`)).select();

    function on_select(e, dt, type, indexes) {
        const row_data = table.rows(indexes).data().toArray();
        const ids = row_data.map(row => row.id);
        const prev_ids = selected_experiments_input.getValue();
        selected_experiments_input.setValue(prev_ids.concat(ids));
    }

    function on_deselect(e, dt, type, indexes) {
        const row_data = table.rows(indexes).data().toArray();
        const prev_ids = selected_experiments_input.getValue();
        selected_experiments_input.clear();
        row_data.forEach((row) => {
            const id_index = prev_ids.indexOf(row.id);
            prev_ids.splice(id_index, 1);
        });
        selected_experiments_input.setValue(prev_ids);
    }

    table.on('select', on_select);
    table.on('deselect', on_deselect);
}
