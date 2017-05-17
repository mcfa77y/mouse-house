$(function() {
    $('#mice').DataTable();

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
