import { setup_update_page_buttons } from './cs-model-common';
import { setup_mouse_table, model_name } from './cs-cage-common';

$(() => {
    setup_update_page_buttons(model_name);
    setup_mouse_table();
});
