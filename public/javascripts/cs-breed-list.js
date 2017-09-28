$(function() {
	const column_names = ['id',
                    'id_alias',
                    'male_mouse',
                    'female_mouse',
                    'pairing_date',
                    'plug_date',
                    'litter_date',
                    'end_date',
                    'pup_check_date',
                    'male_count',
                    'female_count',
                    'notes']

     const table = setup_table({ model_name: 'breed', column_names, hide_id_column: true })
     setup_list_page_buttons('breed', table)
})
