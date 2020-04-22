import Axios from 'axios';

import { form_ids_vals, json_string } from '../cs-form-helper';

const FOOBAR = {
    sorted_mod_mw_map: {},
    symmetricGlycosylation: true
}

const error = ({ response }) => {
    const results = $('#results');
    let warning = `<div class="alert alert-warning" role="alert">${JSON.stringify(arguments[0], null, 2)}</div>`;
    // let warning = `<div class="alert alert-warning" role="alert">${arguments[0])}</div>`;
    if (response !== undefined && response.data !== undefined && response.data.message !== undefined) {
        warning = `<div class="alert alert-warning" role="alert">${response.data.message}</div>`;
    }
    results.html(warning);
}

const update_mw = () => {
    do_plot();
    const sorted_mod_mw_map = get_sorted_mod_mw_map();
    const root_mod_name = get_root_mod_name();
    const checked_el = $("input:checked");
    const key = [...checked_el]
        .filter((x: HTMLInputElement) => x.value.includes('_'))
        .filter((x: HTMLInputElement) => x.id.toLowerCase().includes(root_mod_name))
        .reduce((acc, x: HTMLInputElement) => {
            const value = x.value.toLowerCase();
            acc.push(value);
            if (value.includes('glycosylation') && FOOBAR.symmetricGlycosylation) {
                acc.push(value);
            }
            return acc
        }, [])
        .sort().join("_").toLowerCase();
    const mw = parseFloat(sorted_mod_mw_map[root_mod_name][key]);
    $('#results').html("<h2>molecular weight: " + mw.toFixed(2) + "</hw>");
}

const get_root_mod_name = () => {
    return $("#pills-tab a.active").text().toLowerCase();
}
const smmm = { sorted_mod_mw_map: {} };
const get_sorted_mod_mw_map = () => {
    return smmm.sorted_mod_mw_map;
}
const set_sorted_mod_mw_map = (sorted_mod_mw_map) => {
    smmm.sorted_mod_mw_map = sorted_mod_mw_map;
}
const do_plot = () => {
    const sorted_mod_mw_map = get_sorted_mod_mw_map();
    const root_mod_name = get_root_mod_name();
    const x = Object.keys(sorted_mod_mw_map[root_mod_name]);
    const y: number[] = Object.values(sorted_mod_mw_map[root_mod_name]);
    const range = 0.5
    const y_min = Math.min(...y) * (100 - range) / 100.0;
    const y_max = Math.max(...y) * (100 + range) / 100.0;
    const width = []
    for (let i = 0; i < x.length - 1; i++) {
        width.push[1];
    }
    const data = [
        {
            x,
            y,
            type: 'bar',
            width
        }
    ];
    const layout = {
        yaxis: {
            range: [y_min, y_max],
            categoryorder: 'category ascending'
        },
    }

    Plotly.newPlot('plot', data, layout);
}
const setup_results = (sorted_mod_mw_map) => {
    set_sorted_mod_mw_map(sorted_mod_mw_map);
    do_plot();
    const nav_link_el = $('a[data-toggle="pill"]');
    const checkbox_el = $("input:checkbox");
    const radio_group_el = $("input:radio[name$='_radio']");

    // find checkboxes that have corresponding radio buttons
    const checkbox_el_list = [...checkbox_el]
    const radio_el_id_set = new Set([...radio_group_el].map(x => x.id.split("_").slice(0, 2).join("_")));
    checkbox_el_list
        .filter((x: HTMLInputElement) => {
            // find checkboxes with radios
            let [root_mod_name, mod_type, el_type] = x.id.split("_");
            const radio_el_id_name = [root_mod_name, mod_type].join('_');
            return radio_el_id_set
                .has(radio_el_id_name)
        })
        .forEach((x: HTMLInputElement) => {
            // turn off radios when you uncheck checkbox
            // turn on first radio when you check checkbox
            $(x).click(() => {
                let [root_mod_name, mod_type, el_type] = x.id.split("_");
                const radio_group_el = $(`input[type='radio'][name='${root_mod_name}_${mod_type}_radio']`);
                const radio_group: HTMLInputElement[] = <HTMLInputElement[]>[...radio_group_el];
                if ($(x).prop('checked')) {
                    // enable
                    radio_group.forEach((x) => {
                        x.disabled = false;
                    });
                    // select first radio button
                    radio_group[0].checked = true;
                }
                else {
                    // reset radio button group and disable
                    radio_group.forEach((x) => {
                        x.checked = false;
                        x.disabled = true;
                    });
                }
            })
        })


    checkbox_el.change(() => {
        update_mw();
    });
    radio_group_el.change(() => {
        update_mw();
    });
    nav_link_el.on('shown.bs.tab', function (e) {
        update_mw();
    });

    $('[id$=reset_button').click((event) => {
        const root_mod_name = $("#pills-tab a.active").text().toLowerCase()
        const checked_el = $("input:checked");
        const key = [...checked_el]
            .filter((x: HTMLInputElement) => x.id.toLowerCase().includes(root_mod_name))
            .forEach((x: HTMLInputElement) => x.checked = false);
        $('#results').html("");
    });

}

const setup_form = () => {

    const success = (res) => {
        $('#mods').html(res.data.html);

        setup_results(res.data.sorted_mod_mw_map);
    }

    const submit_button = $('#submit');
    // const sequence_input: HTMLInputElement = <HTMLInputElement>document.querySelector('#sequence');
    const json_input: HTMLInputElement = <HTMLInputElement>document.querySelector('#json');

    submit_button.click((e) => {
        e.preventDefault();
        // const data_struct = {
        //     sequences: [],
        //     engineeredCysCount: 2,
        //     interchain_HH_LinkCount: 2,
        //     interchain_HL_LinkCount: 1,
        //     symmetricGlycosylation: true,
        //     fusionPosition: 0,
        //     conceptUid: "ABP1AA00095"
        // }
        // const seq_list = sequence_input.value.split('\n');
        // const data = { ...data_struct };
        // data.sequences = seq_list;
        const data = JSON.parse(json_input.value);
        const uri = "http://reswebappdev303.gene.com:21135/tapir-helm2-service/calculation/antibodyModificationMolecularWeights"
        // Axios.post(uri, data, {
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // })
        //     .then(success)
        //     .catch(error);
        Axios.post('/mw', data)
            .then(success)
            .catch(error);

        // var settings = {
        //     "url": "http://reswebappdev303.gene.com:21135/tapir-helm2-service/calculation/antibodyModificationMolecularWeights",
        //     "method": "POST",
        //     "timeout": 0,
        //     "headers": {
        //         "Content-Type": "application/json"
        //     },
        //     "data": JSON.stringify({ "sequences": ["DIQMTQSPSSLSASVGDRVTITCKASQGFNKYVAWYQQKPGKAPKLLIYYTSTLQPGVPSRFSGSGSGRDYTLTISSLQPEDFATYYCLQYGDLLYAFGQGTKVEIKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC", "EVQLVQSGAEVKKPGASVKVSCKASGYTFTSYWIGWVRQAPGQGLEWIGDIYPGGGYTNYNEKFKGRVTITRDTSTSTAYLELSSLRSEDTAVYYCARLAGSSYRGAMDSWGQGTLVTVSSCSTKGPSVFPLAPSSKSTSGGTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSSLGTQTYICNVNHKPSNTKVDKKVEPKSCDKTHTCPPCPAPELLGGPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCKVSNKALPAPIEKTISKAKGQPREPQVYTLPPSREEMTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLSPGK", "EVQLVQSGAEVKKPGASVKVSCKASGYTFTSYWIGWVRQAPGQGLEWIGDIYPGGGYTNYNEKFKGRVTITRDTSTSTAYLELSSLRSEDTAVYYCARLAGSSYRGAMDSWGQGTLVTVSSCSTKGPSVFPLAPSSKSTSGGTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSSLGTQTYICNVNHKPSNTKVDKKVEPKSCDKTHTCPPCPAPELLGGPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCKVSNKALPAPIEKTISKAKGQPREPQVYTLPPSREEMTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLSPGK", "DIQMTQSPSSLSASVGDRVTITCKASQGFNKYVAWYQQKPGKAPKLLIYYTSTLQPGVPSRFSGSGSGRDYTLTISSLQPEDFATYYCLQYGDLLYAFGQGTKVEIKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC"], "engineeredCysCount": 2, "interchain_HH_LinkCount": 2, "interchain_HL_LinkCount": 1, "symmetricGlycosylation": true, "fusionPosition": 0, "conceptUid": "ABP1AA00095" }),
        // };

        // $.ajax(settings).done(function (response) {
        //     console.log(response);
        // });
    });

    const demo_json = {
        'sequences': [
            'DIQMTQSPSSLSASVGDRVTITCKASQGFNKYVAWYQQKPGKAPKLLIYYTSTLQPGVPSRFSGSGSGRDYTLTISSLQPEDFATYYCLQYGDLLYAFGQGTKVEIKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC',
            'EVQLVQSGAEVKKPGASVKVSCKASGYTFTSYWIGWVRQAPGQGLEWIGDIYPGGGYTNYNEKFKGRVTITRDTSTSTAYLELSSLRSEDTAVYYCARLAGSSYRGAMDSWGQGTLVTVSSCSTKGPSVFPLAPSSKSTSGGTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSSLGTQTYICNVNHKPSNTKVDKKVEPKSCDKTHTCPPCPAPELLGGPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCKVSNKALPAPIEKTISKAKGQPREPQVYTLPPSREEMTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLSPGK',
            'EVQLVQSGAEVKKPGASVKVSCKASGYTFTSYWIGWVRQAPGQGLEWIGDIYPGGGYTNYNEKFKGRVTITRDTSTSTAYLELSSLRSEDTAVYYCARLAGSSYRGAMDSWGQGTLVTVSSCSTKGPSVFPLAPSSKSTSGGTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSSLGTQTYICNVNHKPSNTKVDKKVEPKSCDKTHTCPPCPAPELLGGPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCKVSNKALPAPIEKTISKAKGQPREPQVYTLPPSREEMTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLSPGK',
            'DIQMTQSPSSLSASVGDRVTITCKASQGFNKYVAWYQQKPGKAPKLLIYYTSTLQPGVPSRFSGSGSGRDYTLTISSLQPEDFATYYCLQYGDLLYAFGQGTKVEIKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC'
        ],
        'engineeredCysCount': 2,
        'interchain_HH_LinkCount': 2,
        'interchain_HL_LinkCount': 1,
        'symmetricGlycosylation': true,
        'fusionPosition': 0,
        'conceptUid': 'ABP1AA00095'
    }
    $('#json').val(JSON.stringify(demo_json, null, 1));
};



$(() => {
    setup_form();
});
