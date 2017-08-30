$(function() {
    const column_names = ['id', 'id_alias', 'name',
        'type', 'setup_date', 'update_date',
        'end_date', 'mice', 'notes'
    ]
    setup_table({model_name: 'cage', column_names, hide_id_column: true})
    setup_list_page_buttons('cage')
})