$(function() {
    function update_mouse_modal (data) {
        utils.set_text('id_alias', data.id_alias)
        utils.set_text('ear_tag', data.ear_tag)
        utils.set_text('dob', data.dob)
        utils.set_text('notes', data.notes)
        utils.set_select('cage_id', data.cage_id)
        utils.set_select('status_id', data.status_id)
        utils.set_select('genotype_id', data.genotype_id)
        utils.set_radio('sex_id', data.sex_id)
    }

    foo('mouse',
        ['id_alias', 'ear_tag', 'dob',
        'genotype', 'sex', 'notes',
        'status', 'create_timestamp',
        'modify_timestamp'],
        update_mouse_modal)




})
