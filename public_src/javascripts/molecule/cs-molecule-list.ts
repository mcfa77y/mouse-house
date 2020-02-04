import range from 'lodash/range';

import { setup_list_page_buttons } from '../cs-model-common';
import { model_name, column_names } from './cs-molecule-common';

export function setup_table({ model_name, column_names, hide_id_column = false }) {
    const columns = column_names.map((x) => ({ data: x }));

    let table_options: DataTables.Settings = {
        serverSide: true,
        ajax: { url: '/molecule/table', type: 'POST' },
        columns,
        select: { style: 'multi' },
        responsive: true,
        dom: 'lBfrtip',
        buttons: [
            { extend: 'selectAll', className: 'btn btn-secondary' },
            { extend: 'selectNone', className: 'btn btn-secondary' },
            { extend: 'colvis', className: 'btn btn-secondary' },
        ],
        scrollY: '500px',
        scrollCollapse: true,
        paging: true,
        lengthMenu: [
            [5, 10, 25, -1],
            [5, 10, 25, 'All'],
        ],

        info: true,

        // dom: 'Pfrtip',
        pagingType: "simple",
        initComplete() {
            this.api().columns.adjust();
            // const selectable_column = new Set(['form', 'pathway', 'platemap', 'targets'])
            // this.api().columns().every(function () {
            //     const column = this;
            //     const column_name = column.header().innerHTML;
            //     if (selectable_column.has(column_name)) {
            //         var select = $('<select><option value=""></option></select>')
            //             .appendTo($(column.footer()).empty())
            //             .on('change', function () {
            //                 var val = $.fn.dataTable.util.escapeRegex(
            //                     $(this).val()
            //                 );

            //                 column
            //                     .search(val ? '' + val + '' : '', true, false)
            //                     .draw();
            //             });

            //         column.data().unique().sort().each(function (d, j) {
            //             select.append('<option value="' + d + '">' + d + '</option>')
            //         });
            //     }

            // });
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

    // Setup - add a text input to each footer cell
    let table_id = `#${model_name}-list`;
    $(table_id).append(
        $('<tfoot/>').append($(table_id + " thead tr").clone())
    );
    $(table_id + ' tfoot th').each(function () {
        var title = $(table_id + ' thead th').eq($(this).index()).text();
        $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });


    const table: DataTables.Api = $(`#${model_name}-list`).DataTable(table_options);
    // table.searchPanes.container().prependTo(table.table().container());

    // table.buttons().container()
    //     .appendTo(`#${model_name}-list_wrapper .col-md-6:eq(0)`);



    // DataTable

    // Apply the filter
    table.columns().every(function () {
        var column = this;

        $('input', this.footer()).on('keyup change', function () {
            column
                .search(this.value)
                .draw();
        });
    });




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
