const setup_table = (model_name, column_names, use_hidden_id_col = false) => {
    const columns = column_names.map((x) => {
        return { data: x }
    })

    const base_table_options = {
        select: { style: 'multi' },
        columns,
        buttons: ['selectAll','selectNone'],
    }
    if (use_hidden_id_col) {
        table_options = $.extend(base_table_options, {
            columnDefs: [{
                targets: [0],
                visible: false,
                searchable: false
            }]
        })

    } else {
        table_options = base_table_options
    }
    table = $('#' + model_name + '-list').DataTable(table_options);

    const update_modal_button = $('#open-update-' + model_name + '-modal-button')
    const delete_button = $('#open-delete-' + model_name + '-modal-button')

    function get_selected_row_ids() {
        const data = table.rows({ selected: true }).data().pluck('id');

        return _.range(data.length).map((index) => {
            return data[index]
        })
    }

    function update_crud_buttons() {
        const data = table.rows({ selected: true }).data().pluck('id');

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


    function on_select(e, dt, type, indexes) {
        update_crud_buttons()
        if (type === 'row') {

            // do something with the ID of the selected items
        }
    }

    table.on('select', on_select)
    table.on('deselect', on_select)

    // custom table functions
    table.get_selected_row_ids = get_selected_row_ids

    update_crud_buttons()
    return table;

}
const foo = (model_name, column_names, use_hidden_id_col = true) => {
    const table = setup_table(model_name, column_names, use_hidden_id_col)

    // activate nav button icon
    const nav_button = $('a[href="/' + model_name + '"]')
    nav_button.parent().toggleClass('active')

    // const create_modal_button = $('#open-create-' + model_name + '-modal-button')
    const delete_button = $('#delete-' + model_name + '-button')
    const save_button = $('#save-' + model_name + '-button')
    const update_button = $('#update-' + model_name + '-button')
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

    update_button.click(() => {
        const dt = utils.form_ids_vals(model_name + '-fields')
        axios.post('/' + model_name, dt)
            .then(success)
            .catch(error);
    })


    delete_button.click(() => {
        axios.delete('/' + model_name + '/' + table.get_selected_row_ids())
            .then(success)
            .catch(error)
    })

    back_button.click(() => {
        window.location.href = '/' + model_name
        return false;
    })
}