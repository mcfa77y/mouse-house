import Axios from 'axios';
import * as toastr from 'toastr';

import { CELL_TAG, GRID_MODE } from './cs-platemap-utils';
import { get_grid_mode, set_grid_mode } from './cs-platemap-cell';
// import { form_ids_vals } from '../cs-form-helper';


// eslint-disable-next-line import/prefer-default-export
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

    const saved_tags_success = () => {
        toastr.success('tags saved');
    };
    const saved_tags_fail = () => {
        toastr.error('tags saved fail');
    };

    $('#tag_cells_button').click(() => {
        // $('#tag_collapse').collapse('toggle');
        if (get_grid_mode() === GRID_MODE.CREATE_CARD) {
            set_grid_mode(GRID_MODE.TAG_CELL);
        } else {
            set_grid_mode(GRID_MODE.CREATE_CARD);
            const data = new FormData();
            const tags = $('.hover_cell').toArray()
                .filter((x) => !$(x).hasClass('unselected_cell'))
                .map((x) => ({
                    row_col: $(x).attr('value'),
                    tag: $(x).attr('class').replace('hover_cell', '').trim(),
                }));
            tags.forEach((tag) => {
                data.append('tags[]', JSON.stringify(tag));
            });
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
