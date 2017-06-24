$(function() {
	function update_cage_modal (data) {
        utils.set_text('id_alias', data.id_alias)
        utils.set_text('update_date', data.update_date)
        utils.set_text('setup_date', data.setup_date)
        utils.set_text('end_date', data.end_date)
        utils.set_text('notes', data.notes)
        utils.set_select('type_id', data.type_id)
    }
    foo ('cage', ['id_alias', 'name', 'type', 'setup_date', 'update_date', 'end_date', 'mice', 'notes'],
    	update_cage_modal)


})
