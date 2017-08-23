$(function() {
    const columns = ['id', 'id_alias', 'ear_tag', 'age', 'dob',
        'genotype', 'sex', 'notes',
        'status', 'created_at',
        'updated_at'
    ]
    const hide_id_col = true
    foo('mouse', columns, hide_id_col)

    setupSliders()
})

function setupSliders() {
    const slider_options = {
        start: 3,
        connect: 'lower',
        step: 1,
        range: {
            min: 0,
            max: 15
        },
        format: wNumb({ decimals: 0 })
    }
    const slider_ids = ['male', 'female', 'unknown']

    slider_ids
        .filter(id => document.getElementById(id))
        .forEach(id => {
            let s = document.getElementById(id)

            noUiSlider.create(s, slider_options)

            s.noUiSlider.on('update', (values, handle) => {
                const id = $(s).attr('id').split('_')[0]
                const label = $($(s).siblings()[0])
                label.text(id + ": " + values[handle])
            })
        })

}