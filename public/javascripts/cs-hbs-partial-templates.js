(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
Handlebars.partials['breed_create'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "id mouse0 - fk id\nmouse1 - fk id\npairing date - ts\nplug date - ts\ncheck for pup - ts\nlitter dob - ts\nween date - ts\nmale count - int female count - int\ngenotype - enum notes - varchar status - 0,1\n<fieldset>\n    <legend>Breed</legend>\n    <div class=\"row\">\n"
    + ((stack1 = container.invokePartial(partials["form_elements/text_input"],depth0,{"name":"form_elements/text_input","hash":{"placeholder":"1234","description":"ID","id":"idx"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/select_input"],(depth0 != null ? depth0.genotype_data : depth0),{"name":"form_elements/select_input","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/select_input"],(depth0 != null ? depth0.male_mouse_data : depth0),{"name":"form_elements/select_input","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/select_input"],(depth0 != null ? depth0.female_mouse_data : depth0),{"name":"form_elements/select_input","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = container.invokePartial(partials["form_elements/date_input"],depth0,{"name":"form_elements/date_input","hash":{"description":"Pairing","id":"pairing-date"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/date_input"],depth0,{"name":"form_elements/date_input","hash":{"description":"Plug","id":"plug-date"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "    </div>\n"
    + ((stack1 = container.invokePartial(partials["form_elements/text_area_input"],depth0,{"name":"form_elements/text_area_input","hash":{"description":"Notes","id":"notes"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "<div class=\"col-md-12\">\n<button data-toggle=\"collapse\" data-target=\"#demo\" type=\"button\" class=\"btn btn-default\">\n    Add offspring</button>\n    </div>\n<div id=\"demo\" class=\"collapse\">\n    <div class=\"row\">\n"
    + ((stack1 = container.invokePartial(partials["form_elements/date_input"],depth0,{"name":"form_elements/date_input","hash":{"description":"Pup check","id":"pup-check-date"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/date_input"],depth0,{"name":"form_elements/date_input","hash":{"description":"Litter D.O.B.","id":"litter-date-of-birth"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/date_input"],depth0,{"name":"form_elements/date_input","hash":{"description":"Ween","id":"ween-date"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/text_input"],depth0,{"name":"form_elements/text_input","hash":{"placeholder":"3","description":"Male count","id":"male-count"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/text_input"],depth0,{"name":"form_elements/text_input","hash":{"placeholder":"3","description":"Female count","id":"female-count"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "    </div>\n"
    + ((stack1 = container.invokePartial(partials["form_elements/text_area_input"],depth0,{"name":"form_elements/text_area_input","hash":{"description":"Notes","id":"notes2"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>\n\n\n    <div class=\"form-group\">\n        <div class=\"col-md-3 col-md-offset-9\">\n            <button type=\"button\" class=\"btn btn-default\">Reset</button>\n            <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n        </div>\n    </div>\n</fieldset>\n<a href=\"javascript:void(0)\" class=\"btn btn-default btn-fab\"><i class=\"material-icons\">grade</i></a>\n";
},"usePartial":true,"useData":true});
Handlebars.partials['cage_create'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"create-cage-modal\" class=\"modal fade\">\n    <div class=\"modal-dialog modal-lg\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n                <h4 class=\"modal-title\">Add cage</h4>\n            </div>\n            <div class=\"modal-body\">\n                <fieldset id=\"cage-fields\">\n                <div class=\"row\">\n"
    + ((stack1 = container.invokePartial(partials["form_elements/text_input"],depth0,{"name":"form_elements/text_input","hash":{"placeholder":"1234","description":"ID","id":"id"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/select_input"],(depth0 != null ? depth0.cage_type : depth0),{"name":"form_elements/select_input","hash":{"description":"Type","id":"type_id"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/date_input"],depth0,{"name":"form_elements/date_input","hash":{"description":"Setup date","id":"setup_date"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/date_input"],depth0,{"name":"form_elements/date_input","hash":{"description":"Last update","id":"update_date"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/date_input"],depth0,{"name":"form_elements/date_input","hash":{"description":"End date","id":"end_date"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/select_input"],(depth0 != null ? depth0.mice : depth0),{"name":"form_elements/select_input","hash":{"description":"Mice","isMultiple":true,"id":"mouse_ids"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/text_area_input"],depth0,{"name":"form_elements/text_area_input","hash":{"description":"Notes","id":"notes"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "                </div>\n\n                </fieldset>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n                <button id=\"save-cage-button\" type=\"button\" class=\"btn btn-primary\">Save</button>\n            </div>\n        </div>\n    </div>\n</div>\n";
},"usePartial":true,"useData":true});
Handlebars.partials['cage_list'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <tr>\n            <td>"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.setup_date || (depth0 != null ? depth0.setup_date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"setup_date","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.update_date || (depth0 != null ? depth0.update_date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"update_date","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.end_date || (depth0 != null ? depth0.end_date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"end_date","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.mice || (depth0 != null ? depth0.mice : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mice","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4((helpers.ellipsis || (depth0 && depth0.ellipsis) || alias2).call(alias1,(depth0 != null ? depth0.notes : depth0),32,{"name":"ellipsis","hash":{},"data":data}))
    + "</td>\n        </tr>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<table id='cage-list' class=\"mdl-data-table\" cellspacing=\"0\" width=\"100%\">\n    <thead>\n        <tr>\n            <th>#</th>\n            <th>type</th>\n            <th>setup</th>\n            <th>update</th>\n            <th>end</th>\n            <th>mice</th>\n            <th>Notes</th>\n        </tr>\n    </thead>\n    <tbody>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.cages : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </tbody>\n</table>\n"
    + ((stack1 = container.invokePartial(partials.crud_buttons,depth0,{"name":"crud_buttons","hash":{"model_name":"cage"},"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n";
},"usePartial":true,"useData":true});
Handlebars.partials['crud_buttons'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"row\">\n    <div class=\"col-md-6\"></div>\n    <div class=\"col-md-offset-6 col-md-6\">\n        <span class=\"pull-right\">\n			<button id=\"open-create-"
    + alias4(((helper = (helper = helpers.model_name || (depth0 != null ? depth0.model_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"model_name","hash":{},"data":data}) : helper)))
    + "-modal-button\" type=\"button\" class=\"btn btn-info btn-fab\" data-toggle=\"modal\" data-target=\"#create-"
    + alias4(((helper = (helper = helpers.model_name || (depth0 != null ? depth0.model_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"model_name","hash":{},"data":data}) : helper)))
    + "-modal\"><i class=\"material-icons\">add</i> </button>\n	    </span>\n        <span class=\"pull-right\">\n	    	<button id=\"open-delete-"
    + alias4(((helper = (helper = helpers.model_name || (depth0 != null ? depth0.model_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"model_name","hash":{},"data":data}) : helper)))
    + "-modal-button\"  type=\"button\" class=\"btn btn-danger btn-fab\" data-toggle=\"modal\" data-target=\"#delete-"
    + alias4(((helper = (helper = helpers.model_name || (depth0 != null ? depth0.model_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"model_name","hash":{},"data":data}) : helper)))
    + "-modal\"><i class=\"material-icons\">delete</i></button>\n	    </span>\n	    <span class=\"pull-right\">\n	    	<button id=\"open-update-"
    + alias4(((helper = (helper = helpers.model_name || (depth0 != null ? depth0.model_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"model_name","hash":{},"data":data}) : helper)))
    + "-modal-button\" type=\"button\" class=\"btn btn-success btn-fab\" data-toggle=\"modal\" data-target=\"#update-"
    + alias4(((helper = (helper = helpers.model_name || (depth0 != null ? depth0.model_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"model_name","hash":{},"data":data}) : helper)))
    + "-modal\"><i class=\"material-icons\">mode_edit</i></button>\n	    </span>\n    </div>\n</div>";
},"useData":true});
Handlebars.partials['mouse-list'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <tr>\n            <td>"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.ear_tag || (depth0 != null ? depth0.ear_tag : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ear_tag","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.dob || (depth0 != null ? depth0.dob : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dob","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.genotype || (depth0 != null ? depth0.genotype : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"genotype","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.sex || (depth0 != null ? depth0.sex : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sex","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4((helpers.ellipsis || (depth0 && depth0.ellipsis) || alias2).call(alias1,(depth0 != null ? depth0.notes : depth0),32,{"name":"ellipsis","hash":{},"data":data}))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.create_timestamp || (depth0 != null ? depth0.create_timestamp : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"create_timestamp","hash":{},"data":data}) : helper)))
    + "</td>\n            <td>"
    + alias4(((helper = (helper = helpers.modify_timestamp || (depth0 != null ? depth0.modify_timestamp : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"modify_timestamp","hash":{},"data":data}) : helper)))
    + "</td>\n        </tr>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<table id='mouse-list' class=\"mdl-data-table\" cellspacing=\"0\" width=\"100%\">\n    <thead>\n        <tr>\n            <th>#</th>\n            <th>Ear tag</th>\n            <th>D.O.B</th>\n            <th>Genotype</th>\n            <th>Sex</th>\n            <th>Notes</th>\n            <th>Status</th>\n            <th>Cage</th>\n            <th>Breed</th>\n        </tr>\n    </thead>\n    <tbody>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.mice : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </tbody>\n</table>\n"
    + ((stack1 = container.invokePartial(partials.crud_buttons,depth0,{"name":"crud_buttons","hash":{"model_name":"mouse"},"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
Handlebars.partials['mouse_create'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"create-mouse-modal\" class=\"modal fade\">\n    <div class=\"modal-dialog  modal-lg\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n                <h4 class=\"modal-title\">Add mouse</h4>\n            </div>\n            <div class=\"modal-body\">\n                <fieldset id=\"mouse-fields\">\n                    <div class=\"row\">\n"
    + ((stack1 = container.invokePartial(partials["form_elements/text_input"],depth0,{"name":"form_elements/text_input","hash":{"placeholder":"1234","description":"ID","id":"id"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/text_input"],depth0,{"name":"form_elements/text_input","hash":{"placeholder":"1234","description":"Ear tag","id":"ear_tag"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/select_input"],(depth0 != null ? depth0.status : depth0),{"name":"form_elements/select_input","hash":{"description":"Status","id":"status_id"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/select_input"],(depth0 != null ? depth0.cages : depth0),{"name":"form_elements/select_input","hash":{"description":"Cage","id":"cage_id"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/select_input"],(depth0 != null ? depth0.genotype : depth0),{"name":"form_elements/select_input","hash":{"description":"Genotype","id":"genotype_id"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/date_input"],depth0,{"name":"form_elements/date_input","hash":{"description":"D.O.B.","id":"dob"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["form_elements/radio_input"],(depth0 != null ? depth0.sex : depth0),{"name":"form_elements/radio_input","hash":{"description":"Sex","id":"sex_id"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "                    </div>\n"
    + ((stack1 = container.invokePartial(partials["form_elements/text_area_input"],depth0,{"name":"form_elements/text_area_input","hash":{"description":"Notes","id":"notes"},"data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "                </fieldset>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n                <button id=\"save-mouse-button\" type=\"button\" class=\"btn btn-primary\">Save</button>\n            </div>\n        </div>\n    </div>\n</div>\n";
},"usePartial":true,"useData":true});
Handlebars.partials['nav'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"navbar navbar-inverse\">\n    <div class=\"container-fluid\">\n        <div class=\"navbar-header\">\n            <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-inverse-collapse\">\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n            </button>\n            <a class=\"navbar-brand\" href=\"/\"><img src=\"/images/mouse.svg\" style=\"width:70px\"></a>\n        </div>\n        <div class=\"navbar-collapse collapse navbar-inverse-collapse\">\n            <ul class=\"nav navbar-nav\">\n                <li class=\"nav-item\">\n                    <a class=\"nav-link\" href=\"/mouse\"><i class=\"fa fa-mouse-pointer fa-2x\" aria-hidden=\"true\"></i></a>\n                </li>\n                <li class=\"nav-item\">\n                    <a class=\"nav-link\" href=\"/cage\"><i class=\"fa fa-home fa-2x\" aria-hidden=\"true\"></i></a>\n                </li>\n                <li class=\"nav-item\">\n                    <a class=\"nav-link\" href=\"/breed\"><i class=\"fa fa-heart-o fa-2x\" aria-hidden=\"true\"></i></a>\n                </li>\n                <li class=\"nav-item\">\n                    <a class=\"nav-link\" href=\"/add-enum\"><i class=\"fa fa-plus-square fa-2x\" aria-hidden=\"true\"></i></a>\n                </li>\n            </ul>\n            <ul class=\"nav navbar-nav navbar-right\">\n                <li><a href=\"javascript:void(0)\">Login</a></li>\n            </ul>\n        </div>\n    </div>\n</div>\n\n";
},"useData":true});
Handlebars.partials['third_party_head'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<script src=\"/javascripts/jquery-3.1.1.min.js\"></script>\n\n<link rel='stylesheet' href='/third-party/tether-1.3.3/css/tether.css' />\n<script src=\"/third-party/tether-1.3.3/js/tether.min.js\"></script>\n<!-- <link rel='stylesheet' href='/third-party/bootstrap-4.0.0-alpha.6-dist/css/bootstrap.css' />\n    <script src=\"/third-party/bootstrap-4.0.0-alpha.6-dist/js/bootstrap.js\"></script>\n     -->\n<link rel='stylesheet' href='/third-party/bootstrap-3.3.7/css/bootstrap.css' />\n<script src=\"/third-party/bootstrap-3.3.7/js/bootstrap.js\"></script>\n\n<link rel='stylesheet' href='/third-party/bootstrap-material-design/css/bootstrap-material-design.min.css' />\n<link rel='stylesheet' href='/third-party/bootstrap-material-design/css/ripples.min.css' />\n<script src=\"/third-party/bootstrap-material-design/js/material.min.js\"></script>\n<script src=\"/third-party/bootstrap-material-design/js/ripples.min.js\"></script>\n\n<script src=\"/third-party/handlebars-4.0.6/handlebars.min.js\"></script>\n\n<link rel=\"stylesheet\" href=\"/third-party/font-awesome-4.7.0/css/font-awesome.min.css\">\n\n<script src=\"/third-party/toastr-2.1.3/toastr.min.js\"></script>\n<link rel='stylesheet' href='/third-party/toastr-2.1.3/toastr.min.css' />\n\n<script src=\"/third-party/underscore-1.8.3/underscore.min.js\"></script>\n\n<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>\n\n\n<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>\n<script src=\"/third-party/unsorted/rome.js\"></script>\n<script src=\"/third-party/unsorted/moment.js\"></script>\n<script src=\"/third-party/material-datetime-picker-2.3.0/material-datetime-picker.js\" charset=\"utf-8\"></script>\n<link rel='stylesheet' href='/third-party/material-datetime-picker-2.3.0/material-datetime-picker.css' />\n\n<link href=\"/third-party/selectize-0.12.4/selectize.css\" rel=\"stylesheet\" />\n<script src=\"/third-party/selectize-0.12.4/selectize.min.js\"></script>\n\n<script src=\"/third-party/unsorted/jquery.dataTables.min.js\"></script>\n<script src=\"/third-party/unsorted/dataTables.material.min.js\"></script>\n<link href=\"/third-party/unsorted/material.min.css\" rel=\"stylesheet\" />\n<link href=\"/third-party/unsorted/dataTables.material.min.css\" rel=\"stylesheet\" />\n\n<link rel=\"stylesheet\" type=\"text/css\" href=\"/third-party/unsorted/buttons.dataTables.min.css\"/>\n<link rel=\"stylesheet\" type=\"text/css\" href=\"/third-party/unsorted/colReorder.dataTables.min.css\"/>\n<link rel=\"stylesheet\" type=\"text/css\" href=\"/third-party/unsorted/responsive.dataTables.min.css\"/>\n<link rel=\"stylesheet\" type=\"text/css\" href=\"/third-party/unsorted/select.dataTables.min.css\"/>\n\n<script type=\"text/javascript\" src=\"/third-party/unsorted/dataTables.buttons.min.js\"></script>\n<script type=\"text/javascript\" src=\"/third-party/unsorted/buttons.colVis.min.js\"></script>\n<script type=\"text/javascript\" src=\"/third-party/unsorted/buttons.html5.min.js\"></script>\n<script type=\"text/javascript\" src=\"/third-party/unsorted/dataTables.colReorder.min.js\"></script>\n<script type=\"text/javascript\" src=\"/third-party/unsorted/dataTables.responsive.min.js\"></script>\n<script type=\"text/javascript\" src=\"/third-party/unsorted/dataTables.select.min.js\"></script>\n\n\n<script src=\"/third-party/unsorted/axios.min.js\"></script>\n\n\n\n\n";
},"useData":true});
Handlebars.partials['form_elements/date_input'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return " <div class=\"form-group   label-floating col-md-3 col-sm-6\">\n    <label for=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"control-label\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</label>\n    <div class=\"input-group\">\n        <input type=\"text\" class=\"form-control c-datepicker-input\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n        <span class=\"input-group-btn\">\n	     	<button type=\"button\" class=\"btn btn-fab btn-fab-mini today-btn\">\n	        	<i class=\"material-icons\">today</i>\n	      	</button>\n    </span>\n    </div>\n</div>\n";
},"useData":true});
Handlebars.partials['form_elements/radio_input'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "    <div class=\"radio radio-primary\">\n        <label>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.isFirst : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.program(4, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "            "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.description : depth0), depth0))
    + "\n        </label>\n    </div>\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "            <input type=\"radio\" id=\""
    + alias2(alias1((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "_"
    + alias2(alias1((depth0 != null ? depth0.description : depth0), depth0))
    + "\"  checked=\"\" name=\""
    + alias2(alias1((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "\" value=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\">\n";
},"4":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "            <input type=\"radio\" id=\""
    + alias2(alias1((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "_"
    + alias2(alias1((depth0 != null ? depth0.description : depth0), depth0))
    + "\" name=\""
    + alias2(alias1((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "\" value=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\">\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "<div class=\"form-group  label-floating col-md-3 col-sm-6\">\n    <label class=\"control-label\">"
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</label>\n"
    + ((stack1 = (helpers.forEach || (depth0 && depth0.forEach) || alias2).call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"forEach","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true,"useDepths":true});
Handlebars.partials['form_elements/select_input'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <select class=\"form-control foo-select\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" multiple=\"multiple\">\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <select class=\"form-control foo-select\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n";
},"5":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "            <option value=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.description : depth0), depth0))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"form-group label-floating  col-md-3 col-sm-6\">\n    <label for=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\" control-label\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</label>\n    <div class=\"\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isMultiple : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\n    </div>\n</div>\n";
},"useData":true});
Handlebars.partials['form_elements/text_area_input'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"form-group col-md-12\">\n    <label for=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"control-label\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</label>\n    <textarea class=\"form-control\" rows=\"3\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</textarea>\n</div>\n";
},"useData":true});
Handlebars.partials['form_elements/text_input'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"form-group label-floating  col-md-3 col-sm-6\">\n    <label for=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\" control-label\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</label>\n    <div >\n        <input type=\"text\" class=\"form-control\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" >\n    </div>\n</div>\n\n\n";
},"useData":true});
})();