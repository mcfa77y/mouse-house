
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
            return [].concat(form.find(':text, select').toArray()
                .filter((el)=>{return $(el).attr('id') !== undefined})
                .filter((el)=>{return $(el).attr('id').length > 0})
                .filter((el)=>{return !$(el).attr('id').includes('-selectized')})
                .map(utils.id_to_val))
                .concat(form.find('textarea').toArray().map(utils.id_to_val))
                .concat(form.find(':radio:checked').toArray().map(utils.name_to_val))
                .reduce((accumulator, currentValue) => {
                    return Object.assign(accumulator, currentValue);
                }, {})
        }

    }
