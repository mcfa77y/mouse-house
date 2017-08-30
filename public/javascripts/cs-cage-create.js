$(function() {


    setup_mouse_table();
    setup_create_page_buttons('cage')
})

function setup_mouse_table() {
    const mouse_columns = ['id', 'id_alias', 'ear_tag', 'age', 'dob',
        'genotype', 'sex', 'notes',
        'status', 'created_at',
        'updated_at'
    ]
    const table = setup_table({ model_name: 'mouse', column_names: mouse_columns, hide_id_column: true })
    const selected_mice_input = $('#mouse_ids')[0].selectize
    function on_select(e, dt, type, indexes) {
        console.log('\n\n')
        const row_data = table.rows(indexes).data().toArray();
        const ids = row_data.map(row => row.id)
        const prev_ids = selected_mice_input.getValue()
        selected_mice_input.setValue(prev_ids.concat(ids))

        console.log('indexes: ' +indexes )

    }

    function on_deselect(e, dt, type, indexes) {
        console.log('\n\n')
        const row_data = table.rows(indexes).data().toArray();
        const prev_ids = selected_mice_input.getValue()
        row_data.forEach(row => {
            const id_index = prev_ids.indexOf(row.id)
            prev_ids.splice(id_index, 1)
        })
        debugger
        prev_ids.length == 0 ? selected_mice_input.clear() : selected_mice_input.setValue(prev_ids)

        console.log('indexes: ' +indexes )

    }

    table.on('select', on_select)
    table.on('deselect', on_deselect)
}