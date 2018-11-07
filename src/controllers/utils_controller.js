const Logger = require('bug-killer');
const moment = require('moment');
const isFalsey = require('falsey');

// String.prototype.toProperCase = function () {
//     return this.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
// };

const option_fn = (value, default_value = '', modifier_fn = null) => {
    let result = '';
    if (!isFalsey(value)) {
        if (isFalsey(modifier_fn)) {
            result = value;
        } else {
            result = modifier_fn(value);
        }
    } else {
        result = default_value;
    }
    return result;
};

const format_date_fn = (date, format = 'MM/DD/YYYY') => moment(date, moment.ISO_8601).format(format);

module.exports = {
    log_json: (json) => {
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
        Logger.log(result);
    },
    log: (message) => {
        Logger.log(message);
    },
    generate_uuid: () => {

    },
    option: option_fn,
    option_date: value => option_fn(value, '', format_date_fn),
    relative_time: date => moment().diff(moment(date, moment.ISO_8601), 'week'),

    format_date: format_date_fn,

    remove_empty: (obj_original, remove_emptyStrings = false) => {
        const obj = Object.assign({}, obj_original);
        Object.keys(obj)
            .forEach((key) => {
                const is_id_key = (key.indexOf('id') === 0 || key.indexOf('_id') > 0);
                const is_value_empty = isFalsey(obj[key]);

                // delete empty ids
                if (is_id_key && is_value_empty) {
                    console.log(`empty - remove key: ${key}`);
                    delete obj[key];
                }

                // delete empty values
                if (remove_emptyStrings) {
                    console.log(`empty - remove key: ${key}`);
                    is_value_empty && delete obj[key];
                }
            });
        return obj;
    },
};

// exports.log_json =(json)=>{Logger.log(JSON.stringify(json, null, 4))}
