
    var utils = {

        set_text: (id, value = '') => {
            $('#'+id).val(value).change()
        },
        set_select: (id, value='') => {
            $('#'+id)[0].selectize.setValue(""+value)
        },
        set_radio: (id, value='') =>{
            // turn off all previous checks
            $(`:radio[name^="${id}"]:checked`).prop('checked', false)
            $(`:radio[name^="${id}"]`).toArray().forEach(
                (radio)=>{
                    if ($(radio).val() == value) {
                        $(radio).prop('checked', true)
                    }
                })
        },
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
            return [].concat(form.find(':text, select, :hidden').toArray()
                .filter((el)=>{return $(el).attr('id') !== undefined})
                .filter((el)=>{return $(el).attr('id').length > 0})
                .filter((el)=>{return !$(el).attr('id').includes('-selectized')})
                .map(utils.id_to_val))
                .concat(form.find('textarea').toArray().map(utils.id_to_val))
                .concat(form.find(':radio:checked').toArray().map(utils.name_to_val))
                .reduce((accumulator, currentValue) => {
                    return Object.assign(accumulator, currentValue);
                }, {})
        },

        json_string : (json) => {
            let cache = [];
            const result = JSON.stringify(json, (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Circular reference found, discard key
                        return;
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            }, 4);
            cache = null; // Enable garbage collection
            return result
        }

    }
