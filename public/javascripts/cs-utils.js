
    var utils = {
        id_to_val: (el) => {
            var result = {};
            result[$(el).attr('id')] = $(el).val();
            return result;
        },
        name_to_val: (el) => {
            var result = {};
            result[$(el).attr('name')] = $(el).val();
            return result;
        },
        form_ids_vals: (form_id) => {
            const form = $('#'+form_id);
            return [].concat(form.find(':text, select').toArray().map(utils.id_to_val))
                .concat(form.find(':radio:checked').toArray().map(utils.name_to_val))
                .reduce((accumulator, currentValue) => {
                    return Object.assign(accumulator, currentValue);
                }, {})
        }

    }
