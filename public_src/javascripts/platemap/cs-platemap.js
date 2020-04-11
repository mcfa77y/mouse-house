import { setup_tag } from './cs-platemap-tag';
import { setup_grid_cells, set_grid_mode } from './cs-platemap-cell';
import { setup_cards } from './cs-platemap-cards';
import { GRID_MODE } from './cs-platemap-utils';

const data_the_table = () => {
    const table_options = {
        scrollX: true,
        paging: false,
    };
    $('#platemap_table').DataTable(table_options);
};


$(() => {
    set_grid_mode(GRID_MODE.CREATE_CARD);
    // setup_selects();
    setup_grid_cells();
    setup_cards();
    setup_tag();

    data_the_table();
});
