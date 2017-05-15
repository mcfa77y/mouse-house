$(function() {
    $('#mice').DataTable( {
        "ajax": {
            "url": "/mice",
            "type": "GET"
            },
        "columns":[
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
    } );

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

})
