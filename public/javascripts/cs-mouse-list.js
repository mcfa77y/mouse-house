$(function() {
    const column_names = ['id', 'id_alias', 'ear_tag', 'age', 'dob',
        'genotype', 'sex', 'notes',
        'status', 'created_at',
        'updated_at'
    ]
    const mouse_table = setup_table({ model_name: 'mouse', column_names, hide_id_column: true })

    setup_aggregation_buttons(mouse_table)
    setup_list_page_buttons('mouse')
    setup_cage_mice_modal(mouse_table)
})

const setup_aggregation_buttons = (table) => {
    
    const pair_button = $('#breed-mouse-button')
    const cage_button = $('#cage-mouse-button')

    function update_buttons() {
        const selected_row_count = table.rows({ selected: true }).data().pluck('id').length

        let disable_pair = true
        let disable_cage = true

        // todo: create validation for M1 : F*
        if (selected_row_count > 2){
            disable_pair = false
        }

        if (selected_row_count > 0){
            disable_cage = false
        }
        

        pair_button.attr('disabled', disable_pair)
        cage_button.attr('disabled', disable_cage)
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


    pair_button.click(()=>{
        const mouse_ids = table.get_selected_row_ids()
        const data = {
            mouse_ids
        }
        axios.post('/mouse/breed_mice_together', data)
            .then(success)
            .catch(error);
    })

}

const setup_cage_mice_modal = (mouse_table) => {
    let columns = ['id', 'id_alias', 'name',
        'type', 'setup_date', 'update_date',
        'end_date', 'mice', 'notes'
    ]
    columns = columns.map((x) => {
        return { data: x }
    })

    const table_options = {
        select: true,
        responsive: true,
        // dom: 'lBfrtip',
        // buttons: ['selectAll', 'selectNone', 'copy', 'excel', 'pdf'],
        columns,
        lengthMenu: [
            [5, 10, 25, -1],
            [5, 10, 25, "All"]
        ]
    }

    let table = $('#cage-list').DataTable(table_options);

    function get_selected_row_ids() {
        const data = table.rows({ selected: true }).data().pluck('id');

        return _.range(data.length).map((index) => {
            return data[index]
        })
    }
    table.get_selected_row_ids = get_selected_row_ids


    const success = (response) => {
        console.log(response)
        toastr['success']("updated")
        window.location.href = '/mouse'
        return false
    }

    const error = (error) => {
        console.log(error)
        toastr['error'](error)
    }

    const cage_mice_together_button = $('#cage-mice-together-button')
    cage_mice_together_button.click(()=>{
        const mouse_ids = mouse_table.get_selected_row_ids()
        const cage_id = table.get_selected_row_ids()
        const data = {
            mouse_ids,
            cage_id
        }
        axios.post('/mouse/cage_mice_together', data)
            .then(success)
            .catch(error);
    })
    // setup_table({model_name: 'cage', column_names, hide_id_column:true })
}