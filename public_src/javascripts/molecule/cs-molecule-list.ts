import range from 'lodash/range';

import { setup_list_page_buttons, get_selected_row_ids, get_selected_row_name_ids } from '../cs-model-common';
import { model_name, column_names, column_name_index_map, column_hide_index_list } from './cs-molecule-common';

export function setup_table({ model_name, column_names }) {
    const columns = column_names.map((x) => ({ data: x }));
    columns[column_name_index_map['platemap']].render = (data, type, row) => {
        const html = `<a href='platemap/${data.id}'>${data.name}</a>`;
        return html;
    }
    columns[column_name_index_map['name']].render = (data, type, row) => {
        const html = `<a href='molecule/${data.id}' target='_blank'>${data.name}</a>`;
        return html;
    }
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
            [50, 100, 250, -1],
            [50, 100, 250, 'All'],
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

    // if (hide_id_column) {
    // table_options = $.extend(table_options, {
    //     columnDefs: [{
    //         targets: [],
    //         visible: false,
    //         // searchable: false,
    //     }],
    // });
    // }
    const columnDefs = column_hide_index_list.reduce((acc, hidden_index) => {
        const foo = {
            targets: hidden_index,
            visible: false
        }
        acc.push(foo);
        return acc;
    }, []);

    table_options = $.extend(table_options, {
        columnDefs
    });

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




    // const update_modal_button = $(`#update-${model_name}-button`);
    // const delete_button = $(`#open-delete-${model_name}-modal-button`);
    const adjust_columns_button = $('#adjust-columns-button');
    adjust_columns_button.on('click', () => {
        table.columns.adjust();
    })
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

const setup_shopping_cart = (table) => {
    const cart = $('#molecule_id_list').selectize();
    const cart_selectize = cart[0].selectize;
    const add_button = $('#add-to-cart-button');
    add_button.click(() => {
        const selected_molecule_name_id_list = get_selected_row_name_ids(table);
        const prev_selected_id_list: string[] = cart_selectize.getValue();
        const curr_selected_id_list: string[] = [];
        selected_molecule_name_id_list
            .filter(({id}) => {
                return !prev_selected_id_list.includes(id + "")
            })
            .forEach(({name, id}) => {
                const id_string = id +"";
                curr_selected_id_list.push(id_string);
                cart_selectize.addOption({ value: id_string, text: name})
            })
        cart_selectize.setValue([...cart_selectize.getValue(), ...curr_selected_id_list]);
        cart_selectize.refreshOptions();
    });

    const view_cart_button = $('#view-cart-button');
    view_cart_button.click(() => {
        const molecule_id_list = cart_selectize.getValue()
        const url = "/molecule/multi/" + molecule_id_list.join("_");
        
        window.open(url, '_blank');
    })
}

$(document).ready(() => {
    const molecule_table = setup_table({ model_name, column_names });
    setup_shopping_cart(molecule_table);
    // setup_list_page_buttons(model_name, molecule_table);
});
