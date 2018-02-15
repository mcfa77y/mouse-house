import { format_date_from_date } from './cs-model-common';

const setup_link_plug_pup_check_dates = () => {
    const plug_date_elem = $('#plug_date');
    plug_date_elem.change(() => {
        const pup_check_offset_days = 21;
        const input_date = plug_date_elem.val();
        const plug_date = new Date(input_date);
        plug_date.setDate(plug_date.getDate() + pup_check_offset_days);
        const pup_check_date = format_date_from_date(new Date(plug_date));
        $('#pup_check_date').val(pup_check_date);
        $('#pup_check_date').change();
    });
};

export { setup_link_plug_pup_check_dates };
