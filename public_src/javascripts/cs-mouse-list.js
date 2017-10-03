import * as Toastr from 'toastr'
import range from 'lodash/range'
import * as Axios from 'Axios'

import 'bootstrap'
import 'datatables.net'
import 'datatables.net-select';
import 'datatables.net-select-dt/css/select.dataTables.css';
import 'datatables.net-responsive';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';

import { setup_table, setup_list_page_buttons } from './cs-model-common'
import { form_ids_vals, json_string } from './cs-form-helper'
import { column_names as cage_column_names } from './cs-cage-common'
import { column_names, model_name } from './cs-mouse-common'

$(function() {
    const mouse_table = setup_table({ model_name, column_names, hide_id_column: true })

    setup_aggregation_buttons(mouse_table)
    setup_list_page_buttons(model_name, mouse_table)
    setup_cage_mice_modal(mouse_table)
})

const setup_aggregation_buttons = (table) => {

    const pair_button = $('#breed-mouse-button')
    const cage_button = $('#cage-mouse-button')
    const status_button = $('#status-mouse-button')

    function update_buttons() {
        const selected_row_count = table.rows({ selected: true }).data().pluck('id').length

        let disable_pair = true
        let disable_cage = true
        let disable_status = true
        // todo: create validation for M1 : F*
        if (selected_row_count >= 2) {
            disable_pair = false
        }

        if (selected_row_count > 0) {
            disable_cage = false
            disable_status = false
        }


        pair_button.attr('disabled', disable_pair)
        cage_button.attr('disabled', disable_cage)
        status_button.attr('disabled', disable_status)
    }

    function on_select(e, dt, type, indexes) {
        update_buttons()
        if (type === 'row') {

            // do something with the ID of the selected items
        }
    }

    update_buttons()
    table.on('select', on_select)
    table.on('deselect', on_select)


    pair_button.click(() => {
        const mouse_ids = table.get_selected_row_ids()
        const data = {
            mouse_ids
        }
        Axios.post('/mouse/breed_mice_together', data)
            .then((response) => {
                console.log(response)
                Toastr.success("paired")
                window.location.href = '/mouse'
                return false
            })
            .catch((error) => {
                console.log(error)
                Toastr.error(error)
            });
    })
    
    $('#set-status-mouse-button').click(()=>{
        const mouse_ids = table.get_selected_row_ids()

        const data = $.extend({mouse_ids}, form_ids_vals('mouse-status-fields'))
        Axios.post('/mouse/update_mice_status', data)
            .then((response) => {
                console.log(response)
                Toastr.success("paired")
                window.location.href = '/mouse'
                return false
            })
            .catch((error) => {
                console.log(error)
                Toastr.error(error)
            });
    })
}

const setup_cage_mice_modal = (mouse_table) => {
    let columns = cage_column_names

    columns = columns.map((x) => {
        return { data: x }
    })

    const table_options = {
        select: true,
        responsive: true,
        dom: 'lBfrtip',
        buttons: ['colvis'],
        columns,
        scrollY: "100%",
        paging: false,
        info: false,
        columnDefs: [{
            targets: [0],
            visible: false,
            searchable: false
        }],
        initComplete: function() {
            this.api().columns.adjust()
        }
    }


    let cage_name_input = $('#cage_name')
    let table = $('#cage-list').DataTable(table_options);

    function on_select(e, dt, type, indexes) {
        cage_name_input.val('')
    }
    table.on('select', on_select)

    cage_name_input.change(() => {
        table.rows().deselect()
    })

    function get_selected_row_ids() {
        const data = table.rows({ selected: true }).data().pluck('id');

        return range(data.length).map((index) => {
            return data[index]
        })
    }
    table.get_selected_row_ids = get_selected_row_ids


    const success = (response) => {
        console.log(response)
        Toastr.success("updated")
        window.location.href = '/mouse'
        return false
    }

    const error = (error) => {
        console.log(error)
        Toastr.error(error)
    }

    const cage_mice_together_button = $('#cage-mice-together-button')
    cage_mice_together_button.click(() => {

        const mouse_ids = mouse_table.get_selected_row_ids()
        const cage_id = table.get_selected_row_ids()
        let data = {
            mouse_ids,
            cage_id
        }
        const dt = form_ids_vals('mouse-cage-fields')
        json_string(dt)

        data = $.extend(data, dt);
        Axios.post('/mouse/cage_mice_together', data)
            .then(success)
            .catch(error);
    })
    // setup_table({model_name: 'cage', column_names, hide_id_column:true })
}