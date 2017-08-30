$(function() {
    const column_names = ['id', 'id_alias', 'ear_tag', 'age', 'dob',
        'genotype', 'sex', 'notes',
        'status', 'created_at',
        'updated_at'
    ]
    setup_table({model_name:'mouse', column_names, hide_id_column:true})

    setup_update_page_buttons('cage')
})
