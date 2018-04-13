import { format_date_from_date } from './cs-model-common';

export const setup_link_plug_pup_check_dates = () => {
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

export const setup_link_dob_ween_dates = () => {
    const litter_date_elem = $('#litter_date');
    litter_date_elem.change(() => {
        const ween_offset_days = 21;
        const input_date = litter_date_elem.val();
        const litter_date = new Date(input_date);
        litter_date.setDate(litter_date.getDate() + ween_offset_days);
        const ween_date = format_date_from_date(new Date(litter_date));
        $('#ween_date').val(ween_date);
        $('#ween_date').change();
    });
};

