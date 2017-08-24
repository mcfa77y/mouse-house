$(function() {
    const mouse_columns = ['id', 'id_alias', 'ear_tag', 'age', 'dob',
        'genotype', 'sex', 'notes',
        'status', 'created_at',
        'updated_at'
    ]
    setup_table('mouse', mouse_columns, true)

    setup_create_page_buttons('cage')
})
