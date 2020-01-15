import Axios from 'axios';
import * as toastr from 'toastr';

import { CELL_TAG, GRID_MODE } from './cs-grid-utils';
import { get_grid_mode, set_grid_mode } from './cs-grid-cell';
import { form_ids_vals } from './cs-form-helper';

export const set_cell_tag = (cell_tag, target_element) => {
    Object.values(CELL_TAG).forEach((tag) => {
        target_element.removeClass(tag);
    });
    target_element.addClass(cell_tag);
};

export const setup_tag = () => {
    $('#reset_cells').click(() => {
        Object.values(CELL_TAG).forEach((tag) => {
            $('.hover_cell').removeClass(tag);
            $('.hover_cell').addClass(CELL_TAG.UNSELECTED);
        });
    });

    $('#select_all_undefined_cells').click(() => {
        const cells = $('.hover_cell.unselected_cell');
        cells.addClass(CELL_TAG.SELECTED);
        cells.removeClass(CELL_TAG.UNSELECTED);
    });
    $('#select_col_undefined_cells').click(() => {
        const cells = $('.hover_cell.selected_cell');

        cells.addClass(CELL_TAG.SELECTED);
        cells.removeClass(CELL_TAG.UNSELECTED);
    });

    $('#apply_tags').click(() => {
        $('.hover_cell.unselected_cell').addClass('selected_cell');
    });

    const saved_tags_success = ({ response }) => {
        toastr.success('tags saved');
    };
    const saved_tags_fail = ({ response }) => {
        toastr.error('tags saved fail');
    };

    $('#tag_cells_button').click(() => {
        if (get_grid_mode() === GRID_MODE.CREATE_CARD) {
            set_grid_mode(GRID_MODE.TAG_CELL);
        } else {
            set_grid_mode(GRID_MODE.CREATE_CARD);
            const data = form_ids_vals('grid-fields');
            const tags = $('.hover_cell').toArray()
                .filter(x => !$(x).hasClass('unselected_cell'))
                .map(x => ({
                    row_col: $(x).attr('value'),
                    tag: $(x).attr('class').replace('hover_cell', '').trim(),
                }));
            tags.forEach((tag) => {
                data.append('tags[]', JSON.stringify(tag));
            });
            data.set('metadata_csv_label', document.getElementById('metadata_csv_label').innerText);
            data.set('grid_data_csv_label', document.getElementById('grid_data_csv_label').innerText);
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
    $('#green_button').click(() => {
        foo(CELL_TAG.GREEN);
    });
    $('#red_button').click(() => {
        foo(CELL_TAG.RED);
    });
    $('#black_button').click(() => {
        foo(CELL_TAG.BLACK);
    });
    $('#blue_button').click(() => {
        foo(CELL_TAG.BLUE);
    });
    $('#grey_button').click(() => {
        foo(CELL_TAG.GREY);
    });
    $('#yellow_button').click(() => {
        foo(CELL_TAG.YELLOW);
    });
};
