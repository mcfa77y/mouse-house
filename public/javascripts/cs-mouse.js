(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['foo.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"entry\">\n    <h1>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\n    <div class=\"body\">\n      "
    + alias4(((helper = (helper = helpers.body || (depth0 != null ? depth0.body : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"body","hash":{},"data":data}) : helper)))
    + "\n    </div>\n  </div>\n";
},"useData":true});
})();

$(function() {
    foo('mouse', ['id', 'ear_tag', 'dob', 'genotype', 'sex', 'notes', 'status', 'create_timestamp', 'modify_timestamp'])




    // var table = $('#mice').DataTable({
    //     select: {
    //         style: 'multi'
    //     },
    //     columns:[
    //         {"data": "id"},
    //         {"data": "ear_tag"},
    //         {"data": "dob"},
    //         {"data": "genotype"},
    //         {"data": "sex"},
    //         {"data": "notes"},
    //         {"data": "status"},
    //         {"data": "create_timestamp"},
    //         {"data": "modify_timestamp"},
    //     ]

    // });
    // function update_crud_buttons (){
    //     var data = table.rows( {selected: true} ).data().pluck( 'id' );
    //     var disableCreate = false
    //     var disableDelete = true
    //     var disableUpdate = true

    //     if(data.length === 1){
    //         disableCreate = true
    //         disableDelete = false
    //         disableUpdate = false
    //     }
    //     else if(data.length>1){
    //         disableCreate = true
    //         disableDelete = false
    //         disableUpdate = true
    //     }

    //     $('#open-create-mouse-modal-button').attr('disabled', disableCreate)
    //     $('#open-delete-mouse-modal-button').attr('disabled', disableDelete)
    //     $('#open-update-mouse-modal-button').attr('disabled', disableUpdate)
    // }

    // function get_selected_row_ids(){
    //     var data = table.rows( {selected: true} ).data().pluck( 'id' );
    //     return _.range(data.length).map((index)=> {return data[index]})[0]
    // }
    // function on_select ( e, dt, type, indexes ) {
    //     update_crud_buttons()
    //     if ( type === 'row' ) {

    //         // do something with the ID of the selected items
    //     }
    // }
    // table.on('select', on_select)
    // table.on('deselect', on_select)

    // update_crud_buttons()

    // $('#save-mouse-button').click(() => {
    //     const dt = utils.form_ids_vals('mouse-fields')
    //     axios.post('/mouse', dt)
    //         .then(function(response) {
    //             console.log(response);
    //         })
    //         .catch(function(error) {
    //             console.log(error);
    //         });
    // })

    // $('#open-update-mouse-modal-button').click(() =>{
    //     axios.get('/mouse/' + get_selected_row_ids())
    //         .then((resp)=>{
    //             toastr["success"](utils.json_string(resp))
    //         })
    //         .catch((err)=>{
    //             toastr['error']('delete something happened' + utils.json_string(err))
    //         })
    // })
    // $('#open-delete-mouse-modal-button').click(() =>{
    //     axios.delete('/mouse/' + get_selected_row_ids())
    //         .then((resp)=>{
    //             toastr["success"](utils.json_string(resp))
    //         })
    //         .catch((err)=>{
    //             toastr['error']('delete something happened' + utils.json_string(err))
    //         })
    // })
    // $('#save-cage-button').click(() => {
    //     const dt = utils.form_ids_vals('cage-fields')
    //     axios.post('/cage', dt)
    //         .then(function(response) {
    //             console.log(response);
    //         })
    //         .catch(function(error) {
    //             console.log(error);
    //         });
    // })


})
