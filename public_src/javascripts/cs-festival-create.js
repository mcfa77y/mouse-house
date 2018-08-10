import * as Axios from 'axios';
import { default as wNumb } from 'wnumb';
import * as noUiSlider from 'nouislider';

import { form_ids_vals } from './cs-form-helper';
import { setupToastr, success, error } from './cs-model-common';

function setup_sliders() {
    const slider_options = {
        start: 3,
        connect: 'lower',
        step: 1,
        range: {
            min: 1,
            max: 5,
        },
        format: wNumb({ decimals: 0 }),
    };
    const slider_ids = ['song_count'];

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

const setup_default_values = () => {
    $('#festival_name').val('Outside Lands 2018');
    $('#artist_list').val(`AJNA
    Amen Dunes
    AQUILO
    Bahamas
    Beck
    BIG GIGANTIC
    Billie Eilish
    Bon Iver
    BØRNS
    Broken Social Scene
    Caleborate
    Carly Rae Jepsen
    Chicano Batman
    Chromeo
    CHVRCHES
    Claptone
    Cuco
    Daniel Caesar
    Dermot Kennedy
    Dick Stusso
    DJ Snake
    Durand Jones & The Indications
    ELOHIM
    Emmit Fenn
    Father John Misty
    Florence + the Machine
    Freya Ridings
    Future
    Gogo Penguin
    GOLDLINK
    Gryffin
    Hobo Johnson & the LoveMakers
    Hot Flash Heat Wave
    Illenium
    Jack Harlow
    James Blake
    Jamie XX
    Janelle Monáe
    Janet Jackson
    Jessie Reyez
    Kailee Morgue
    Kelela
    Kikagaku Moyo
    Knox Fortune
    LAUV
    Lizzo
    LP
    Lucy Dacus
    Mac Demarco
    Margo Price
    Mikky Ekko
    Monophonics
    N.E.R.D
    Nick Mulvey
    ODESZA
    Olivia O’Brien
    Pale Waves
    Perfume Genius
    Poolside
    Poolside
    Portugal. The Man
    Quinn XCII
    RAINBOW KITTEN SURPRISE
    Rex Orange County
    Saba
    Sabrina Claudio
    Sasha Sloan
    Shannon and the Clams
    Smokepurpp
    SOB x RBE
    Sweet Plot
    T Sisters
    Tash Sultana
    THE GROWLERS
    THE INTERNET
    The Mountain Goats
    The Weeknd
    TYCHO
    Whethan`);
};

const setup_create_button = () => {
    const button = $('#create_playlist_button');
    button.click(() => {
        const dt = form_ids_vals('festival-fields');
        Axios.post('/festival', dt)
            .then(success)
            .catch(error);
    });
};
$(() => {
    setup_sliders();
    setupToastr();
    setup_default_values();
    setup_create_button();
});
