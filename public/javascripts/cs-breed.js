$(function() {
	function update_breed_modal (data) {
        utils.set_text('id_alias', data.id_alias)
        utils.set_text('pairing_date', data.pairing_date)
        utils.set_text('plug_date', data.plug_date)
        utils.set_text('litter_date', data.litter_date)
        utils.set_text('ween_date', data.ween_date)
        utils.set_text('pup_check_date', data.pup_check_date)
        utils.set_select('type_id', data.type_id)
        utils.set_text('notes', data.notes)
    }
    foo ('breed', ['id_alias', 
                    'name', 
                    'type', 
                    'plug_date', 
                    'litter_date', 
                    'ween_date', 
                    'pairing_date', 
                    'pup_check_date', 
                    'mice', 
                    'notes'],
    	update_breed_modal)


})
