import * as Toastr from 'toastr'
import _ from 'lodash'
import * as Axios from 'Axios'
import * as Moment from 'moment'
import MaterialDatetimePicker from 'material-datetime-picker';
import {form_ids_vals, json_string} from './cs-form-helper'


export function setup_table ({ model_name, column_names, hide_id_column = false }) {
    const columns = column_names.map((x) => {
        return { data: x }
    })

    let table_options = {
        select: { style: 'multi' },
        responsive: true,
        dom: 'lBfrtip',
        // buttons: ['selectAll', 'selectNone', 'copy', 'excel', 'pdf','colvis'],
        buttons: ['selectAll', 'selectNone', 'excel', 'colvis'],
        scrollY: 450,
        paging: false,
        info: false,
        columns,
        lengthMenu: [
            [5, 10, 25, -1],
            [5, 10, 25, "All"]
        ]
    }

    if (hide_id_column) {
        table_options = $.extend(table_options, {
            columnDefs: [{
                targets: [0],
                visible: false,
                searchable: false
            }]
        })

    }

    const table = $('#' + model_name + '-list').DataTable(table_options);

    const update_modal_button = $('#update-' + model_name + '-button')
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
    }

    table.on('select', on_select)
    table.on('deselect', on_select)

    // custom table functions
    table.get_selected_row_ids = get_selected_row_ids

    update_crud_buttons()
    return table;

}
export function success(response) {
    console.log(response)
    Toastr.success("updated")
    // window.location.href = '/' + model_name
    // return false
}

export function error(error) {
    console.log(error)
    Toastr.error(error)
}

export function nav_button(model_name) {
    // activate nav button icon
    const nav_button = $('a[href="/' + model_name + '"]')
    nav_button.parent().toggleClass('active')
}

export function setup_create_page_buttons(model_name) {
    init_page(model_name)
    const save_button = $('#save-' + model_name + '-button')
    const back_button = $('#back-' + model_name + '-button')

    save_button.click(() => {
        const dt = form_ids_vals(model_name + '-fields')
        Axios.put('/' + model_name, dt)
            .then(success)
            .catch(error);
    })

    back_button.click(() => {
        window.location.href = '/' + model_name
        return false;
    })
}

export function setup_update_page_buttons(model_name){
    init_page(model_name)
    const update_button = $('#update-' + model_name + '-button')
    const back_button = $('#back-' + model_name + '-button')

    update_button.click(() => {
        const dt = form_ids_vals(model_name + '-fields')
        json_string(dt)
        Axios.post('/' + model_name, dt)
            .then(success)
            .catch(error);
    })

    back_button.click(() => {
        window.location.href = '/' + model_name
        return false;
    })
}

export function setup_list_page_buttons(model_name, table){
    init_page(model_name)
    const delete_button = $('#delete-' + model_name + '-button')

    delete_button.click(() => {
        Axios.delete('/' + model_name + '/' + table.get_selected_row_ids())
            .then((response) => {
                console.log(response)
                Toastr.success("delete succesful")
                window.location.href = '/' + model_name
                return false
            })
            .catch(error)
    })
}



export function init_page(model_name){
    nav_button(model_name)
    setupToastr()
    setupDropDown()
    setupSelects()
    setupDatePicker()
    setupTodayButton()
    setupToolTip()
}




export function setupToolTip(){
    $('[data-toggle="tooltip"]').tooltip();
}

export function setupTodayButton() {
    $('.today-btn')
        .toArray()
        .forEach((s) => {
            let f = s

            $(s).click(() => {
                let d = new Date()
                let foo = $(f)
                const datestring = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" +
                    d.getFullYear();
                let input = foo.parent().parent().find('.form-control.c-datepicker-input')
                input.val(datestring)
                input.change()
            })
        })

    // $(".js-example-basic-multiple").select2({
    //     placeholder: "Select",
    //     allowClear: true
    // });
}

export function setupSelects() {
    $('.foo-select')
        .toArray()
        .forEach((s) => {
            $(s).selectize({create: true, persist: true})
        })
}


export function setupDropDown() {
    $(".dropdown-menu li a").click(function() {
        const selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
    });
}

export function setupDatePicker() {
    const inputs = document.querySelectorAll('.c-datepicker-input');

    inputs.forEach((input) => {
        // const _container = input.parentElement.children[1]
        // const _container = document.body
        // _container.style.zIndex=1000
        // const picker = new MaterialDatetimePicker({container: _container})
        
        const picker = MaterialDatetimePicker({
                default: Moment(),
                value: Moment()
            })
            .on('submit', (val) => {
                input.value = val.format('MM/DD/YYYY');
                $(input).change()
            })
            .on('open', () => {
                input.value = input.value || Moment().format('MM/DD/YYYY')
                picker.setDate(Moment(input.value, 'MM/DD/YYYY'))
                picker.setTime(Moment(input.value, 'MM/DD/YYYY'))
                // extra styling to make it look good and behave normally
                $('.c-datepicker.c-datepicker--open').css('z-index', 1200)
                $('.c-datepicker__clock').css('padding-top', '357px')
                $('.btn.btn-fab.btn-fab-mini.today-btn, .form-control.c-datepicker-input').prop('disabled', true)

            })
            .on('close', () => {
                $('.btn.btn-fab.btn-fab-mini.today-btn, .form-control.c-datepicker-input').prop('disabled', false)

            })
        input.addEventListener('focus', () => picker.open());
    })
}

export function setupToastr() {
    Toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}