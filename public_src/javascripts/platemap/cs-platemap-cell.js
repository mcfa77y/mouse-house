import Axios from 'axios';
import * as SmilesDrawer from 'smiles-drawer';

// import { form_ids_vals } from '../cs-form-helper';
import {
    GRID_MODE, CELL_TAG, get_target_element_by_class, error,
} from './cs-platemap-utils';
// import { set_cell_tag } from './cs-platemap-tag';

let CURRENT_GRID_MODE = GRID_MODE.CREATE_CARD;

export const set_cell_tag = (cell_tag, target_element) => {
    Object.values(CELL_TAG).forEach((tag) => {
        target_element.removeClass(tag);
    });
    target_element.addClass(cell_tag);
};


export function set_grid_mode(grid_mode) {
    CURRENT_GRID_MODE = grid_mode;
}
export function get_grid_mode() {
    return CURRENT_GRID_MODE;
}
export function setup_grid_cells() {
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

        $(`#${collapse_id}`).on('shown.bs.collapse', () => {
            SmilesDrawer.parse(smiles_string, (tree) => {
                smilesDrawer.draw(tree, canvas_id, 'light', false);
            });
        });
    };

    $(document).on('mousedown', '.hover_cell', (event) => {
        const targetElement = get_target_element_by_class(event, '.hover_cell');
        if (get_grid_mode() === GRID_MODE.CREATE_CARD) {
            const cell = targetElement[0].attributes.value.value;
            // const dt = form_ids_vals('grid-fields');
            const platemap_id = $('#platemap_id').val();
            // dt.append('index', index);
            const dt = { platemap_id, cell };
            Axios.post('/platemap/card', dt)
                .then(create_card)
                .catch(error);
        } else if (get_grid_mode() === GRID_MODE.TAG_CELL) {
            if (targetElement.hasClass(CELL_TAG.SELECTED)) {
                set_cell_tag(CELL_TAG.UNSELECTED, targetElement);
            } else if (targetElement.hasClass(CELL_TAG.UNSELECTED)) {
                set_cell_tag(CELL_TAG.SELECTED, targetElement);
            } else {
                set_cell_tag(CELL_TAG.SELECTED, targetElement);
            }
        }
    });
}
