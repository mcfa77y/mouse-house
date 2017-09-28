$(function() {
    const column_names = ['id', 'id_alias', 'type',
        'end_date', 'mice', 'notes'
    ]
    const table = setup_table({ model_name: 'cage', column_names, hide_id_column: true })
    setup_list_page_buttons('cage', table)
})