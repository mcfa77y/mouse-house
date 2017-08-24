$(function() {
    const column_names = ['id', 'id_alias', 'ear_tag', 'age', 'dob',
        'genotype', 'sex', 'notes',
        'status', 'created_at',
        'updated_at'
    ]
    setup_table({ model_name: 'mouse', column_names, hide_id_column: true })
    setup_list_page_buttons('mouse')
    setup_aggregation_buttons()
})

const setup_aggregation_buttons = () => {
    setup_cage_mice_modal()
    const pair_button = $('#breed-mouse-button')
    const cage_button = $('#cage-mouse-button')
}

const setup_cage_mice_modal = () => {
    let columns = ['id', 'id_alias', 'name',
        'type', 'setup_date', 'update_date',
        'end_date', 'mice', 'notes'
    ]
    columns = column_names.map((x) => {
        return { data: x }
    })

    const table_options = {
        select: true,
        responsive: true,
        dom: 'lBfrtip',
        buttons: ['selectAll', 'selectNone', 'copy', 'excel', 'pdf'],
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

    // setup_table({model_name: 'cage', column_names, hide_id_column:true })
}