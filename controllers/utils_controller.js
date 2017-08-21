const Logger = require('bug-killer');
const moment = require('moment');
const isFalsey = require('falsey');

String.prototype.toProperCase = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
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
        Logger.log(result)
    },
    log: (message) => {
        Logger.log(message)
    },
    generate_uuid: () => {

    },
    relative_time: (date) => {
        return moment().diff(moment(date, moment.ISO_8601), 'week')
    },

    format_time: (date, format = 'MM/DD/YY') => {
        return moment(date, moment.ISO_8601).format(format)
    },

    remove_empty: (obj, remove_emptyStrings = false) => {
        Object.keys(obj)
            .forEach((key) => {
                const is_id_key = (key.indexOf('id') === 0 || key.indexOf('_id') > 0)
                const is_value_empty = isFalsey(obj[key])

                // delete empty ids
                if (is_id_key && is_value_empty) {
                    delete obj[key]
                }

                // delete empty values
                if (remove_emptyStrings) {
                    is_value_empty && delete obj[key]
                }

            })
        return obj
    }
}

// exports.log_json =(json)=>{Logger.log(JSON.stringify(json, null, 4))}