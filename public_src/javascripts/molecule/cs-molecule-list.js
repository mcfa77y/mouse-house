import { setup_table, setup_list_page_buttons } from '../cs-model-common';
import { model_name, column_names } from './cs-molecule-common';

$(document).ready(() => {
    const molecule_table = setup_table({ model_name, column_names, hide_id_column: true });
    setup_list_page_buttons(model_name, molecule_table);
});
