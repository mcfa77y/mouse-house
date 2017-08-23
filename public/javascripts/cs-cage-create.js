$(function() {
    const mouse_columns = ['id', 'id_alias', 'ear_tag', 'dob',
        'genotype', 'sex', 'notes',
        'status', 'created_at',
        'updated_at'
    ]
    setup_table('mouse', mouse_columns, true)

    
    const model_name = 'cage'
    const save_button = $('#save-' + model_name + '-button')
    const back_button = $('#back-' + model_name + '-button')
  
    const success = (response) => {
        console.log(response)
        toastr['success']("updated")
        // window.location.href = '/' + model_name
        // return false
    }

    const error = (error) => {
        console.log(error)
        toastr['error'](error)
    }

    save_button.click(() => {
        const dt = utils.form_ids_vals(model_name + '-fields')
        axios.put('/' + model_name, dt)
            .then(success)
            .catch(error);
    })

    back_button.click(() => {
        window.location.href = '/' + model_name
        return false;
    })

})