$(function() {
    let foo = (json) => {
        let cache = [];
        const result = JSON.stringify(json, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }, 4);
        cache = null; // Enable garbage collection
        return result
    }

    var table = $('#mice').DataTable({
        select: {
            style: 'multi'
        },
        columns:[
            {"data": "id"},
            {"data": "ear_tag"},
            {"data": "dob"},
            {"data": "genotype"},
            {"data": "sex"},
            {"data": "notes"},
            {"data": "status"},
            {"data": "create_timestamp"},
            {"data": "modify_timestamp"},
        ]

    });
    function update_crud_buttons (){
        var data = table.rows( {selected: true} ).data().pluck( 'id' );
            var disableCreate = false
            var disableDelete = true
            var disableUpdate = true

            if(data.length === 1){
                disableCreate = true
                disableDelete = false
                disableUpdate = false
            }
            else if(data.length>1){
                disableCreate = true
                disableDelete = false
                disableUpdate = true
            }

            $('#open-create-mouse-modal-button').attr('disabled', disableCreate)
            $('#open-delete-mouse-modal-button').attr('disabled', disableDelete)
            $('#open-update-mouse-modal-button').attr('disabled', disableUpdate)
    }
    function on_select ( e, dt, type, indexes ) {
        update_crud_buttons()
        if ( type === 'row' ) {
            
            // do something with the ID of the selected items
        }
    }
    table.on('select', on_select)
    table.on('deselect', on_select)

    update_crud_buttons()

    $('#save-mouse-button').click(() => {
        const dt = utils.form_ids_vals('mouse-fields')
        $.post('/mouse', dt)
            .done(function(response) {
                console.log(response);
            })
            .fail(function(error) {
                console.log(error);
            });
    })

    $('#save-cage-button').click(() => {
        const dt = utils.form_ids_vals('cage-fields')
        $.post('/cage', dt)
            .done(function(response) {
                console.log(response);
            })
            .fail(function(error) {
                console.log(error);
            });
    })


})
