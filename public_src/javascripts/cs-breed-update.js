import { setup_update_page_buttons } from './cs-model-common';

function setup_link_plug_pup_check_dates() {
  $('#plug-date').change(() => {
    const foo = $('#plug-date').val();
    console.log(foo);
  });
}

$(() => {
  setup_update_page_buttons('breed');
  setup_link_plug_pup_check_dates();
});
