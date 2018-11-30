import { setup_table, setup_list_page_buttons } from './cs-model-common';

$(() => {
    const column_names = ['id',
        'id_alias',
        'male_mouse',
        'male_mouse_age',
        'female_mouse',
        'female_mouse_age',
        'pairing_date',
        'plug_date',
        'litter_date',
        'end_date',
        'pup_check_date',
        'male_count',
        'female_count',
        'unknown_count',
        'notes'];

    const table = setup_table({ model_name: 'breed', column_names, hide_id_column: true });
    setup_list_page_buttons('breed', table);
});
