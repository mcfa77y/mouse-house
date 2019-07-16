import * as Axios from 'axios';
import * as SmilesDrawer from 'smiles-drawer';
import * as toastr from 'toastr';

import { form_ids_vals } from './cs-form-helper';


const GRID_MODE = {
    CREATE_CARD: 1,
    TAG_CELL: 2,
};
const CELL_TAG = {
    GREEN: 'green',
    RED: 'red',
    BLACK: 'black',
    BLUE: 'blue',
    GREY: 'grey',
    TEAL: 'teal',
    YELLOW: 'yellow',
    SELECTED: 'selected_cell',
    UNSELECTED: 'unselected_cell',
};


let CURRENT_GRID_MODE = GRID_MODE.CREATE_CARD;

const get_target_element_by_class = (event, klass) => {
    const clickedElement = $(event.target);
    let targetElement = clickedElement.closest(klass);
    if (targetElement.length === 0) {
        targetElement = clickedElement.children().closest(klass);
    }
    return targetElement;
};

const error = ({ response }) => {
    const results = $('#results');
    const warning = `<div class="alert alert-warning" role="alert">${response.data.message}</div>`;
    results.html(warning);
};

const set_cell_tag = (cell_tag, target_element) => {
    Object.values(CELL_TAG).forEach((tag) => {
        target_element.removeClass(tag);
    });
    target_element.addClass(cell_tag);
};

const setup_tag = () => {
    $('#reset_cells').click((e) => {
        Object.values(CELL_TAG).forEach((tag) => {
            $('.hover_cell').removeClass(tag);
            $('.hover_cell').addClass(CELL_TAG.UNSELECTED);
        });
    });


    $('#select_all_undefined_cells').click((e) => {
        const cells = $('.hover_cell.unselected_cell');
        cells.addClass(CELL_TAG.SELECTED);
        cells.removeClass(CELL_TAG.UNSELECTED);
    });
    $('#select_col_undefined_cells').click((e) => {
        const cells = $('.hover_cell.selected_cell');

        cells.addClass(CELL_TAG.SELECTED);
        cells.removeClass(CELL_TAG.UNSELECTED);
    });

    $('#apply_tags').click((e) => {
        $('.hover_cell.unselected_cell').addClass('selected_cell');
    });
    const saved_tags_success = ({ response }) => {
        toastr.success('tags saved');
    };
    const saved_tags_fail = ({ response }) => {
        toastr.error('tags saved fail');
    };
    $('#tag_cells_button').click((e) => {
        if (CURRENT_GRID_MODE === GRID_MODE.CREATE_CARD) {
            CURRENT_GRID_MODE = GRID_MODE.TAG_CELL;
        } else {
            CURRENT_GRID_MODE = GRID_MODE.CREATE_CARD;
            const data = form_ids_vals('grid-fields');
            const tags = $('.hover_cell').toArray()
                .filter(x => !$(x).hasClass('unselected_cell'))
                .map(x => ({
                    row_col: $(x).attr('value'),
                    tag: $(x).attr('class').replace('hover_cell', '').trim(),
                }));
            data.append('tags', tags);
            Axios.post('/grid/tags', data)
                .then(saved_tags_success)
                .catch(saved_tags_fail);
        }
    });
    const foo = (tag) => {
        const cells = $('.hover_cell.selected_cell');
        cells.addClass(tag);
        cells.removeClass(CELL_TAG.SELECTED);
    };
    $('#green_button').click((e) => {
        foo(CELL_TAG.GREEN);
    });
    $('#red_button').click((e) => {
        foo(CELL_TAG.RED);
    });
    $('#black_button').click((e) => {
        foo(CELL_TAG.BLACK);
    });
    $('#blue_button').click((e) => {
        foo(CELL_TAG.BLUE);
    });
    $('#grey_button').click((e) => {
        foo(CELL_TAG.GREY);
    });
    $('#yellow_button').click((e) => {
        foo(CELL_TAG.YELLOW);
    });
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

    $(document).on('mousedown', '.hover_cell', (event) => {
        const targetElement = get_target_element_by_class(event, '.hover_cell');
        if (CURRENT_GRID_MODE === GRID_MODE.CREATE_CARD) {
            const index = targetElement[0].attributes.value.value;
            const dt = form_ids_vals('grid-fields');
            dt.append('index', index);
            Axios.post('/grid/card', dt)
                .then(create_card)
                .catch(error);
        } else if (CURRENT_GRID_MODE === GRID_MODE.TAG_CELL) {
            if (targetElement.hasClass(CELL_TAG.SELECTED)) {
                set_cell_tag(CELL_TAG.UNSELECTED, targetElement);
            } else if (targetElement.hasClass(CELL_TAG.UNSELECTED)) {
                set_cell_tag(CELL_TAG.SELECTED, targetElement);
            } else {
                set_cell_tag(CELL_TAG.SELECTED, targetElement);
            }
        }
    });
};

const setup_cards = () => {
    $(document).on('click', '.close-btn', (event) => {
        const targetElement = get_target_element_by_class(event, '.close-btn');
        targetElement.closest('.card').fadeOut({ complete() { $(this).remove(); } });
    });

    $(document).on('click', '.card-img-top', (event) => {
        const targetElement = get_target_element_by_class(event, '.card-img-top');
        const img_uri = targetElement.closest('.card-img-top').attr('src');
        window.open(img_uri, 'Image');
    });
};

const set_custom_file_label = (id, value) => {
    $(`#${id}`).next('.custom-file-label').html(value);
};

const setup_form = () => {
    const results = $('#results');

    const create_table = (response) => {
        $('#results_spinner').collapse('hide');
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
        $('#results_spinner').collapse('show');

        const dt = form_ids_vals('grid-fields');
        Array.from(document.getElementById('image_files').files).forEach((file) => {
            dt.append('image_files', file);
        });
        dt.append('metadata_csv', document.getElementById('metadata_csv').files[0]);
        dt.append('grid_data_csv', document.getElementById('grid_data_csv').files[0]);
        dt.append('metadata_csv_label', document.getElementById('metadata_csv_label').innerText);
        dt.append('grid_data_csv_label', document.getElementById('grid_data_csv_label').innerText);

        Axios.post('/grid/table', dt)
            .then(create_table)
            .catch(error);
    });

    $('#grid_data_csv').change((e) => {
        // get the file name
        const value = document.getElementById('grid_data_csv').files[0].name;
        // replace the "Choose a file" label
        set_custom_file_label('grid_data_csv', value);
    });

    $('#metadata_csv').change((e) => {
        // get the file name
        const value = document.getElementById('metadata_csv').files[0].name;
        // replace the "Choose a file" label
        set_custom_file_label('metadata_csv', value);
    });

    $('#image_files').change((e) => {
        // get the file name
        const value = `${document.getElementById('image_files').files.length} files selected`;
        // replace the "Choose a file" label
        set_custom_file_label('image_files', value);
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
        const value = document.getElementById('config_file').files[0].name;
        // replace the "Choose a file" label
        set_custom_file_label('config_file', value);
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
            grid_data_csv_uri, image_file_uri_list, metadata_csv_uri,
        } = res.data.config;
        set_custom_file_label('grid_data_csv', grid_data_csv_uri);
        set_custom_file_label('metadata_csv', metadata_csv_uri);
        set_custom_file_label('image_files', `${image_file_uri_list.length} files selected`);
    };
    $('#config_name').change(() => {
        const dt = form_ids_vals('grid-fields');
        Axios.get(`/grid/config/${dt.get('config_name_description')}`)
            .then(update_form)
            .catch(error);
    });
};


$(() => {
    CURRENT_GRID_MODE = GRID_MODE.CREATE_CARD;
    setupSelects();
    setup_form();
    setup_upload_config_form();
    setup_grid_cells();
    setup_cards();
    setup_tag();
    $('#configModal').modal('show');
});
