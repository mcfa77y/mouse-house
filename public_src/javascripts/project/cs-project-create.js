import { setup_create_page_buttons } from '../cs-model-common';
import { setup_experiment_table, model_name } from './cs-project-common';

$(() => {
    setup_create_page_buttons(model_name);
    setup_experiment_table();
});
