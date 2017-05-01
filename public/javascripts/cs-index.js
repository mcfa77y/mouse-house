$(function() {
    setupToastr();
    setupDatePicker();
    setupDropDown();
    setupSelects();
    $.material.init();
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

function setupSelects() {
    $('.foo-select-duet')
        .selectize({maxItems: 2});

    $('.foo-select')
        .toArray()
        .forEach((s)=>{$(s).selectize()})

    // $(".js-example-basic-multiple").select2({
    //     placeholder: "Select",
    //     allowClear: true
    // });
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
        const picker = new MaterialDatetimePicker()
            .on('submit', (val) => {
                input.value = val.format("MM/DD/YYYY");
                $(input).change()
            });
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
