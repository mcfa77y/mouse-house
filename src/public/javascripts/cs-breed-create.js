import { setup_create_page_buttons } from './cs-model-common';
import { setup_link_plug_pup_check_dates, setup_link_dob_ween_dates } from './cs-breed-common';
import { setup_mouse_table } from './cs-cage-common';

$(() => {
    setup_create_page_buttons('breed');
    setup_link_plug_pup_check_dates();
    setup_link_dob_ween_dates();
    setup_mouse_table();
});
