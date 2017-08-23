$(function() {
    $.material.init();
    setupToastr();
    setupDropDown();
    setupSelects();
    setupDatePicker();
    setupTodayButton();
    var win;
    var checkConnect;
    let counter = 0;
    var $connect = $("#linkAccount");
    //var oAuthURL = "http://example.com/account/_oauth?redirect_url=" + redirect_url;
    // $.ajax({
    //         method: "GET",
    //         url: "oAuthUrl",

    //     })
    //     .done(function(url) {
    //         $connect.click(function() {
    //             win = window.open(url, 'SomeAuthentication', 'width=972,height=660,modal=yes,alwaysRaised=yes');
    //             checkConnect = setInterval(function() {
    //                 console.log('checking' + counter)
    //                 counter++
    //                 if (!win || !win.closed) return;
    //                 clearInterval(checkConnect);
    //                 // window.location.reload();
    //                 window.location.replace("/do_things");
    //             }, 100);

    //         });
    //     });

    $('#removeDups').click(() => {
        $.ajax({
                method: "GET",
                url: "remove_dups",

            })
            .done(function(url) {
                toastr["success"]("Doops removed")
            })
            .catch((err) => {
                toastr['error']('something happened' + JSAON.parse(err, null, 4))
            });
    })
    $('#listFromFile').click(() => {
        $.ajax({
                method: "GET",
                url: "search_playlist",

            })
            .done(function(data) {
                toastr["success"]("got pl")

            })
            .catch((err) => {
                toastr['error']('something happened' + err)
            });
    })

});

function setupTodayButton() {


    $('.today-btn')
        .toArray()
        .forEach((s) => {
            let f = s

            $(s).click(() => {
                let d = new Date()
                let foo = $(f)
                var datestring = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" +
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

function setupSelects() {
    $('.foo-select')
        .toArray()
        .forEach((s) => {
            $(s).selectize()
        })
}


function setupDropDown() {
    $(".dropdown-menu li a").click(function() {
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
    });
}

function setupDatePicker() {
    const inputs = document.querySelectorAll('.c-datepicker-input');

    inputs.forEach((input) => {
        // const _container = input.parentElement.children[1]
        // const _container = document.body
        // _container.style.zIndex=1000
        // const picker = new MaterialDatetimePicker({container: _container})
        
        const picker = new MaterialDatetimePicker({
                default: moment(),
                value: moment()
            })
            .on('submit', (val) => {
                input.value = val.format('MM/DD/YYYY');
                $(input).change()
            })
            .on('open', () => {
                input.value = input.value || moment().format('MM/DD/YYYY')
                picker.setDate(moment(input.value, 'MM/DD/YYYY'))
                picker.setTime(moment(input.value, 'MM/DD/YYYY'))
                // extra styling to make it look good and behave normally
                $('.c-datepicker.c-datepicker--open').css('z-index', 1200)
                $('.c-datepicker__clock').css('padding-top', '357px')
                $('.btn.btn-fab.btn-fab-mini.today-btn, .form-control.c-datepicker-input').prop('disabled', true)

            })
            .on('close', (val) => {
                $('.btn.btn-fab.btn-fab-mini.today-btn, .form-control.c-datepicker-input').prop('disabled', false)

            })
        input.addEventListener('focus', () => picker.open());
    })
}

function setupToastr() {
    toastr.options = {
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