export function set_text(id, value = '') {
    $(`#${id}`).val(value).change();
}
export function set_select(id, value = '') {
    $(`#${id}`)[0].selectize.setValue(`${value}`);
}
export function set_radio(id, value = '') {
    // turn off all previous checks
    $(`:radio[name^="${id}"]:checked`).prop('checked', false);
    $(`:radio[name^="${id}"]`).toArray().forEach((radio) => {
        if ($(radio).val() === value) {
            $(radio).prop('checked', true);
        }
    });
}
export function id_to_val(el) {
    // const result = {};
    const result = new FormData();
    result.append($(el).attr('id'), $(el).val())
    // result[$(el).attr('id')] = $(el).val();
    return result;
}
export function id_to_val_select(el) {
    // const result = {};
    const result = new FormData();
    result[$(el).attr('id')] = $(el).val();
    const s = el.selectize;
    const v = s.getValue();
    const description = s.getItem(v).text();
    // result[`${$(el).attr('id').replace('_id', '')}_description`] = description;
    result.append(`${$(el).attr('id').replace('_id', '')}_description`, description);
    return result;
}
export function id_to_val_slider(el) {
    // const result = {};
    const result = new FormData();
    // result[$(el).attr('id')] = el.noUiSlider.get();
    result.append($(el).attr('id'), el.noUiSlider.get());
    return result;
}
export function name_to_val(el) {
    // const result = {};
    const result = new FormData();
    // result[$(el).attr('name')] = $(el).val();
    result.append($(el).attr('name'), $(el).val());
    return result;
}
export function form_ids_vals(form_id) {
    const form = $(`#${form_id}`);
    const form_data = new FormData();
    return [].concat(form.find(':text, select, :hidden, input').toArray()
        .filter(el => $(el).attr('id') !== undefined)
        .filter(el => $(el).attr('id').length > 0)
        .filter(el => !$(el).attr('id').includes('-selectized'))
        .filter(el => !$(el).attr('class') || $(el).attr('class') && !$(el).attr('class').includes('selectized'))
        .map(id_to_val))
        .concat(form.find('select').toArray().map(id_to_val_select))
        .concat(form.find('textarea').toArray().map(id_to_val))
        .concat(form.find('.slider').toArray().map(id_to_val_slider))
        .concat(form.find(':radio:checked').toArray().map(name_to_val))
        .reduce((accumulator, currentValue) => {
            for (let pair of currentValue.entries()){
                accumulator.append(pair[0], pair[1])
            }
            return accumulator;
        }, new FormData());
}

export function json_string(json) {
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
    return result;
}

