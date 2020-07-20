import { get_target_element_by_class } from './cs-platemap-utils';

export function setup_cards() {
    $(document).on('click', '.close-btn', (event) => {
        const targetElement = get_target_element_by_class(event, '.close-btn');
        targetElement.closest('.card').fadeOut({ complete() { $(this).remove(); } });
    });

    $(document).on('click', '.card-img-top', (event) => {
        const targetElement = get_target_element_by_class(event, '.card-img-top');
        const img_uri = targetElement.closest('.card-img-top').attr('src');
        window.open(img_uri, 'Image');
    });
}
