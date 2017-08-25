$(function() {
	const column_names = ['id_alias', 
                    'name', 
                    'type', 
                    'plug_date', 
                    'litter_date', 
                    'ween_date', 
                    'pairing_date', 
                    'pup_check_date', 
                    'mice', 
                    'notes']

     setup_table({ model_name: 'mouse', column_names, hide_id_column: true })
     setup_list_page_buttons('breed')
})
