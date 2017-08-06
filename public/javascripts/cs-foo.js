let foo = (model_name, column_names, fn_update_model) => {
    let columns = column_names.map((x) => {
        return { data: x }
    })

    let table = $('#' + model_name + '-list').DataTable({
        select: { style: 'multi' },
        columns
    });

    let create_modal_button = $('#open-create-' + model_name + '-modal-button')
    let update_modal_button = $('#open-update-' + model_name + '-modal-button')
    let delete_button = $('#open-delete-' + model_name + '-modal-button')
    let save_button = $('#save-' + model_name + '-button')
    let update_button = $('#update-' + model_name + '-button')
    let back_button = $('#back-' + model_name + '-button')
    let nav_button = $('a[href="/' + model_name + '"]')

    nav_button.parent().toggleClass('active')

    function update_crud_buttons() {
        let data = table.rows({ selected: true }).data().pluck('id');

        let disableDelete = true
        let disableUpdate = true

        if (data.length === 1) {
            disableDelete = false
            disableUpdate = false
        } else if (data.length > 1) {
            disableDelete = false
            disableUpdate = true
        }

        delete_button.attr('disabled', disableDelete)
        update_modal_button.attr('disabled', disableUpdate)
    }

    function get_selected_row_ids() {
        let data = table.rows({ selected: true }).data().pluck('id_alias');

        return _.range(data.length).map((index) => {
            return $(data[index]).text()
        })
    }

    function on_select(e, dt, type, indexes) {
        update_crud_buttons()
        if (type === 'row') {

            // do something with the ID of the selected items
        }
    }

    table.on('select', on_select)
    table.on('deselect', on_select)

    update_crud_buttons()

    save_button.click(() => {
        const dt = utils.form_ids_vals(model_name + '-fields')
        axios.put('/new_' + model_name, dt)
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    })

    update_button.click(() => {
        const dt = utils.form_ids_vals(model_name + '-fields')
        axios.post('/new_' + model_name, dt)
            .then(function(response) {
                console.log(response)
                toastr['success']("updated")
            })
            .catch(function(error) {
                console.log(error);
                toastr['error']("updated failed")
            });
    })


    delete_button.click(() => {
        axios.delete('/new_' + model_name + '/' + get_selected_row_ids())
            .then((resp) => {
                toastr["success"](utils.json_string(resp))
                window.location.href = '/new_' + model_name
                return false
            })
            .catch((err) => {
                toastr['error']('delete something happened' + utils.json_string(err))
            })
    })

    back_button.click(() => {
        window.location.href = '/new_' + model_name
        return false;
    })
}
