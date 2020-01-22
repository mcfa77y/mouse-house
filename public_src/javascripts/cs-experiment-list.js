import { setup_table, setup_list_page_buttons } from './cs-model-common';


$(document).ready(() => {
    const model_name = 'experiment';
    const column_names = ['id', 'name', 'note', 'grid_data_uri', 'metadata_uri', 'image_config', 'tag_config', 'updated_at', 'created_at'];
    const experiment_table = setup_table({ model_name, column_names, hide_id_column: true });
    setup_list_page_buttons(model_name, experiment_table);
});
