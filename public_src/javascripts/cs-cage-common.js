import contains from 'underscore-es/contains';
import { setup_table } from './cs-model-common';
import { column_names as mouse_column_names, model_name as mouse_model_name } from './cs-mouse-common';

export const model_name = 'cage';

export const column_names = ['id', 'id_alias', 'type',
    'end_date', 'mice', 'notes',
];

export function setup_mouse_table() {
    const table = setup_table({ model_name: mouse_model_name, column_names: mouse_column_names, hide_id_column: true });

    const selected_mice_input = $('#mouse_ids')[0].selectize;
    selected_mice_input.disable();

    const show_mouse_table_button = $('#show-mouse-table-button2');
    show_mouse_table_button.click(() => {
        table.columns.adjust()
            .responsive.recalc().draw();
    });
    $(document).on('shown.bs.modal', (e) => {
        console.log('\nshowN : ' + '\n');

        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    });
    $(document).on('show.bs.modal', (e) => {
        console.log('\nshow: ' + '\n');

        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    });

    const selected_ids = selected_mice_input.getValue();

    table.rows((idx, data) => contains(selected_ids, `${data.id}`)).select();

    function on_select(e, dt, type, indexes) {
        const row_data = table.rows(indexes).data().toArray();
        const ids = row_data.map(row => row.id);
        const prev_ids = selected_mice_input.getValue();
        selected_mice_input.setValue(prev_ids.concat(ids));
    }

    function on_deselect(e, dt, type, indexes) {
        const row_data = table.rows(indexes).data().toArray();
        const prev_ids = selected_mice_input.getValue();
        selected_mice_input.clear();
        row_data.forEach((row) => {
            const id_index = prev_ids.indexOf(row.id);
            prev_ids.splice(id_index, 1);
        });
        selected_mice_input.setValue(prev_ids);
    }

    table.on('select', on_select);
    table.on('deselect', on_deselect);
}
