import { setup_update_page_buttons } from './cs-model-common';
import { setup_link_plug_pup_check_dates, setup_link_dob_ween_dates } from './cs-breed-common';

$(() => {
    setup_update_page_buttons('breed');
    setup_link_plug_pup_check_dates();
    setup_link_dob_ween_dates();
});
