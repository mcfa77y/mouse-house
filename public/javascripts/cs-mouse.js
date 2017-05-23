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

    function get_selected_row_ids(){
        var data = table.rows( {selected: true} ).data().pluck( 'id' );
        return _.range(data.length).map((index)=> {return data[index]})[0]
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
        axios.post('/mouse', dt)
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    })

    $('#open-update-mouse-modal-button').click(() =>{
        axios.get('/mouse/' + get_selected_row_ids())
            .then((resp)=>{
                toastr["success"](foo(resp))
            })
            .catch((err)=>{
                toastr['error']('delete something happened' + foo(err))
            })
    })
    $('#open-delete-mouse-modal-button').click(() =>{
        axios.delete('/mouse/' + get_selected_row_ids())
            .then((resp)=>{
                toastr["success"](foo(resp))
            })
            .catch((err)=>{
                toastr['error']('delete something happened' + foo(err))
            })
    })
    $('#save-cage-button').click(() => {
        const dt = utils.form_ids_vals('cage-fields')
        axios.post('/cage', dt)
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    })


})
