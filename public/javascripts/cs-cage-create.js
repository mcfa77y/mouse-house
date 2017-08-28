$(function() {
    const mouse_columns = ['id', 'id_alias', 'ear_tag', 'age', 'dob',
        'genotype', 'sex', 'notes',
        'status', 'created_at',
        'updated_at'
    ]
    setup_table({model_name: 'mouse', column_names: mouse_columns, hide_id_column: true})

    setup_create_page_buttons('cage')
})
