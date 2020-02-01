import { setup_list_page_buttons } from '../cs-model-common';
import { model_name, column_names } from './cs-molecule-common';
import range from 'lodash/range';

require( 'datatables.net-bs4' )();
require( 'datatables.net-buttons-bs4' )();
require( 'datatables.net-buttons/js/buttons.colVis.js' )();
require( 'datatables.net-fixedheader-bs4' )();
require( 'datatables.net-responsive-bs4' )();
require( 'datatables.net-scroller-bs4' )();
require( 'datatables.net-searchpanes-bs4' )();
require( 'datatables.net-select-bs4' )();

export function setup_table({ model_name, column_names, hide_id_column = false }) {
    const columns = column_names.map((x) => ({ data: x }));

    let table_options = {
        serverSide: true,
        ajax: {url: '/molecule/table', type: 'POST'},
        columns,
        select: { style: 'multi' },
        responsive: true,
        dom: 'Pfrtip',
        buttons: [
            { extend: 'selectAll', className: 'btn btn-secondary' },
            { extend: 'selectNone', className: 'btn btn-secondary' },
            { extend: 'excel', className: 'btn btn-secondary' },
            { extend: 'colvis', className: 'btn btn-secondary' },
        ],
        scrollY: '500px',
        scrollCollapse: true,
        paging: true,
        info: true,
        searchPanes: true,
        // dom: 'Pfrtip',
        "sPaginationType": "simple",
        lengthMenu: [
            [5, 10, 25, -1],
            [5, 10, 25, 'All'],
        ],
        initComplete() {
            this.api().columns.adjust();
        },
    };

    if (hide_id_column) {
        table_options = $.extend(table_options, {
            columnDefs: [{
                targets: [0],
                visible: false,
                searchable: false,
            }],
        });
    }
    const table = $(`#${model_name}-list`).DataTable(table_options);
    table.searchPanes.container().prependTo(table.table().container());
    
    table.buttons().container()
        .appendTo(`#${model_name}-list_wrapper .col-md-6:eq(0)`);

    const update_modal_button = $(`#update-${model_name}-button`);
    const delete_button = $(`#open-delete-${model_name}-modal-button`);

    function get_selected_row_ids() {
        const data = table.rows({ selected: true }).data().pluck('id');

        return range(data.length).map((index) => data[index]);
    }

    // function update_crud_buttons() {
    //     const data = table.rows({ selected: true }).data().pluck('id');

    //     let disableDelete = true;
    //     let disableUpdate = true;

    //     if (data.length === 1) {
    //         disableDelete = false;
    //         disableUpdate = false;
    //     } else if (data.length > 1) {
    //         disableDelete = false;
    //         disableUpdate = true;
    //     }

    //     delete_button.attr('disabled', disableDelete);
    //     update_modal_button.attr('disabled', disableUpdate);
    // }


    // function on_select() {
    //     update_crud_buttons();
    // }

    // table.on('select', on_select);
    // table.on('deselect', on_select);

    // update_crud_buttons();
    return table;
}

$(document).ready(() => {
    const molecule_table = setup_table({ model_name, column_names, hide_id_column: true });
    setup_list_page_buttons(model_name, molecule_table);
});
