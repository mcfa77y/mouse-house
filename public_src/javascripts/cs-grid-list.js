import * as Axios from 'axios';
import * as SmilesDrawer from 'smiles-drawer';
import { form_ids_vals } from './cs-form-helper';


const foo_this = (event, klass) => {
    const clickedElement = $(event.target);
    const targetElement = clickedElement.closest(klass);
    return targetElement;
};

const error = (err) => {
    const results = $('#results');
    const warning = `<div class="alert alert-warning" role="alert">${err}</div>`;
    results.html(warning);
};

const setup_grid_cells = () => {
    const create_card = (response) => {
        const html_string = `${response.data.html}`;
        $('#image_row').append(html_string);
        const html_jq = $($.parseHTML(html_string));
        const smiles_jq = $(html_jq.find('.smiles')[0]);
        const smiles_string = smiles_jq.text().trim();
        const canvas_id = smiles_jq.find('canvas').attr('id');
        const smilesDrawer = new SmilesDrawer.Drawer({
            width: 450,
            height: 300,
        });
        const collapse_id = $($('#image_row').children().last().find('.metadata_button')[0]).attr('aria-controls');

        $(`#${collapse_id}`).on('shown.bs.collapse', (e) => {
            SmilesDrawer.parse(smiles_string, (tree) => {
                smilesDrawer.draw(tree, canvas_id, 'light', false);
            });
        });
    };

    $(document).on('click', '.hover_cell', (event) => {
        const targetElement = foo_this(event, '.hover_cell');
        const index = targetElement[0].attributes.value.value;
        const dt = $.extend(form_ids_vals('grid-fields'), { index });
        Axios.post('/grid/card', dt)
            .then(create_card)
            .catch(error);

    // $(`#image_${index}`).toggleClass('d-none');
    });
};

const setup_cards = () => {
    $(document).on('click', '.close-btn', (event) => {
        const targetElement = foo_this(event, '.close-btn');
        targetElement.closest('.card').fadeOut({ complete() { $(this).remove(); } });
    });
    $(document).on('click', '.card-img-top', (event) => {
        const targetElement = foo_this(event, '.card-img-top');
        const img_uri = targetElement.closest('.card-img-top').attr('src');
        window.open(img_uri, 'Image');
    });
};

const setup_form = () => {
    const results = $('#results');

    const create_table = (response) => {
        results.html(`${response.data.html}`);
        const table_options = {
            scrollX: true,
            paging: false,
        };
        $('#grid-list').DataTable(table_options);
    };

    const submit_button = $('#submit');
    submit_button.click((e) => {
        e.preventDefault();
        $('#configModal').modal('hide');
        // $('#collapseTwo').collapse('show');

        const dt = form_ids_vals('grid-fields');
        Axios.post('/grid/table', dt)
            .then(create_table)
            .catch(error);
    });
};


const setup_upload_config_form = () => {
    const update_config_select = (res) => {
        const x = $('#config_name').selectize();
        const y = x[0].selectize;
        Object.keys(res.data.config_map).forEach((select_item) => {
            y.addOption({ value: select_item, text: select_item });
            y.refreshOptions();
        });
        $('#uploadModal').modal('hide');
        $('#configModal').modal('show');
    };

    const submit_button = $('#submit_upload');
    submit_button.click((e) => {
        e.preventDefault();

        // $('#collapseTwo').collapse('show');
        const formData = new FormData();
        formData.append('config_file', document.getElementById('config_file').files[0]);
        Axios.post('/grid/config', formData)
            .then(update_config_select)
            .catch(error);
    });

    $('#config_file').change((e) => {
        // get the file name
        const fileName = document.getElementById('config_file').files[0].name;
        // replace the "Choose a file" label
        $('#config_file').next('.custom-file-label').html(fileName);
    });
};

const setupSelects = () => {
    $('.foo-select')
        .toArray()
        .forEach((s) => {
            $(s).selectize({
                plugins: ['restore_on_backspace', 'remove_button'],
                create: true,
                persist: true,
                maxItems: 1,
            });
        });
    const update_form = (res) => {
        console.log(JSON.stringify(res.data.config, null, 2));
        const {
            csv_uri, image_dir_uri, prefix, extension, metadata_csv_uri,
        } = res.data.config;
        $('#csv_uri').val(csv_uri);
        $('#image_dir_uri').val(image_dir_uri);
        $('#prefix').val(prefix);
        $('#extension').val(extension);
        $('#metadata_csv_uri').val(metadata_csv_uri);
    };
    const results = $('#results');
    const error = ({ response }) => {
        const warning = `<div class="alert alert-warning" role="alert">${response.data.message}</div>`;
        results.html(warning);
    };
    $('#config_name').change(() => {
        const dt = form_ids_vals('grid-fields');
        Axios.get(`/grid/config/${dt.config_name}`)
            .then(update_form)
            .catch(error);
    });
};


$(() => {
    setupSelects();
    setup_form();
    setup_upload_config_form();
    setup_grid_cells();
    setup_cards();
    $('#configModal').modal('show');
});
