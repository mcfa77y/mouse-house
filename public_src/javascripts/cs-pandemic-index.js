$(() => {

    const infection_card_list = [{
            city: "Atlanta",
            color: "blue",
            instances: 1
        },
        {
            city: "Bogota",
            color: "yellow",
            instances: 1
        },
        {
            city: "Buenos Aires",
            color: "yellow",
            instances: 2
        },
        {
            city: "Cairo",
            color: "black",
            instances: 3
        },
        {
            city: "Chicago",
            color: "blue",
            instances: 2
        },
        {
            city: "Denver",
            color: "blue",
            instances: 1
        },
        {
            city: "Istanbul",
            color: "black",
            instances: 2
        },
        {
            city: "Jacksonville",
            color: "yellow",
            instances: 3
        },
        {
            city: "Lagos",
            color: "yellow",
            instances: 3
        },
        {
            city: "Lima",
            color: "yellow",
            instances: 1
        },
        {
            city: "London",
            color: "blue",
            instances: 3
        },
        {
            city: "Los Angeles",
            color: "yellow",
            instances: 1
        },
        {
            city: "Mexico City",
            color: "yellow",
            instances: 1
        },
        {
            city: "New York",
            color: "blue",
            instances: 3
        },
        {
            city: "San Francisco",
            color: "blue",
            instances: 2
        },
        {
            city: "Santiago",
            color: "yellow",
            instances: 1
        },
        {
            city: "Sao Paulo",
            color: "yellow",
            instances: 2
        },
        {
            city: "Tripoli",
            color: "black",
            instances: 2
        },
        {
            city: "Washington",
            color: "blue",
            instances: 3
        },
    ]
    console.log('pandemic index');
    const city_select = $('.city_select');
    const find_color = (city_name) => {
        return infection_card_list.find((x) => {
            return x.city == city_name;
        }).color

    }
    const sortUnorderedList = (ul, sortDescending) => {
        if (typeof ul == "string")
            ul = document.getElementById(ul);

        // Idiot-proof, remove if you want
        if (!ul) {
            alert("The UL object is null!");
            return;
        }

        // Get the list items and setup an array for sorting
        var lis = ul.getElementsByTagName("LI");
        var vals = [];

        // Populate the array
        for (var i = 0, l = lis.length; i < l; i++)
            vals.push(lis[i].innerHTML);

        // Sort it
        vals.sort();

        // Sometimes you gotta DESC
        if (sortDescending)
            vals.reverse();

        // Change the list on the page
        for (var i = 0, l = lis.length; i < l; i++)
            lis[i].innerHTML = vals[i];
    }
    const change_fn = (value_list) => {
        if (!value_list.length) return;
        const value = value_list[0];
        city_select[0].selectize.clear();
        const color = find_color(value);
        const group = `${color}-group`
        const button = `<button type="button" class="close" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>`
        $(`#${group}`).append(`<li class="list-group-item" value="${value}">${value}${button}</li>`);
        sortUnorderedList(group);

    }
    $('#infect_button').click(() => {
        const city_name_list = $('.list-group-item').toArray().map(x => x.getAttribute('value'));
        const group_city_name_count = city_name_list.reduce((acc, cur) => {
            if (acc[cur] != null) {
                console.log('found: ' + cur);
                acc[cur] = acc[cur] + 1.0;
            } else {
                console.log('new: ' + cur);
                acc[cur] = 1.0;
            }
            return acc;
        }, {})

        for (const key of Object.keys(group_city_name_count)) {
            const percent = parseFloat(Math.round(group_city_name_count[key]  * 100) / city_name_list.length).toFixed(1);
            group_city_name_count[key] = percent;
        }
        console.log(JSON.stringify(group_city_name_count, null, 2));


    })
    $(document).on('click', '.close', function () {
        $(this).parent().remove();
    });
    city_select.selectize({
        maxItems: null,
        valueField: 'city',
        labelField: 'city',
        searchField: 'city',
        options: infection_card_list,
        create: false,
        onChange: change_fn,
        hideSelected: false,
    });
})