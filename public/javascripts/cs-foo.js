var foo = (model_name, column_names) => {
    let columns = column_names.map((x) => {
        return { data: x }
    })

    let table = $('#' + model_name + '-list').DataTable({
        select: { style: 'multi' },
        columns
    });

    let create_button = $('#open-create-' + model_name + '-modal-button')
    let update_button = $('#open-update-' + model_name + '-modal-button')
    let delete_button = $('#open-delete-' + model_name + '-modal-button')
    let save_button = $('#save-' + model_name + '-button')

    function update_crud_buttons() {
        var data = table.rows({ selected: true}).data().pluck('id');

        var disableDelete = true
        var disableUpdate = true

        if (data.length === 1) {
            disableDelete = false
            disableUpdate = false
        } else if (data.length > 1) {
            disableDelete = false
            disableUpdate = true
        }

        delete_button.attr('disabled', disableDelete)
        update_button.attr('disabled', disableUpdate)
    }

    function get_selected_row_ids() {
        var data = table.rows({ selected: true}).data().pluck('id');

        return _.range(data.length).map((index) => {
            return data[index]
        })[0]
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
        axios.post('/' + model_name, dt)
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    })

    update_button.click(() => {
        axios.get('/' + model_name + '/' + get_selected_row_ids())
            .then((resp) => {
                toastr["success"](utils.json_string(resp))
            })
            .catch((err) => {
                toastr['error']('delete something happened' + utils.json_string(err))
            })
    })

    delete_button.click(() => {
        axios.delete('/' + model_name + '/' + get_selected_row_ids())
            .then((resp) => {
                toastr["success"](utils.json_string(resp))
            })
            .catch((err) => {
                toastr['error']('delete something happened' + utils.json_string(err))
            })
    })
}
