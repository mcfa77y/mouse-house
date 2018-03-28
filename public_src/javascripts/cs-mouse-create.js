import { setup_create_page_buttons } from './cs-model-common';
import { default as wNumb } from 'wnumb';
import * as noUiSlider from 'nouislider';


function setup_sliders() {
    const slider_options = {
        start: 3,
        connect: 'lower',
        step: 1,
        range: {
            min: 0,
            max: 15,
        },
        format: wNumb({ decimals: 0 }),
    };
    const slider_ids = ['male', 'female', 'unknown'];

    slider_ids
        .filter(id => document.getElementById(id))
        .forEach((id) => {
            const s = document.getElementById(id);

            noUiSlider.create(s, slider_options);

            s.noUiSlider.on('update', (values, handle) => {
                const id = $(s).attr('id').split('_')[0];
                const label = $($(s).siblings()[0]);
                label.text(`${id}: ${values[handle]}`);
            });
        });
}

$(() => {
    setup_sliders();
    setup_create_page_buttons('mouse');
});
