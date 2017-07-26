const Logger = require('bug-killer');
const moment = require('moment');
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

    select_json: (items, id, description = '') => {
        if (description === '') {
            description = id.toProperCase()
                .replace('_id', '')
                .replace('_', ' ')
        }
        return {
            id,
            description,
            items
        }
    },

    relative_time: (date) => {
        return moment(date, moment.ISO_8601).fromNow()
    },

    format_time: (date, format='MM/DD/YY') => {
        return moment(date, moment.ISO_8601).format(format)
    },

    remove_empty : (obj, remove_emptyStrings) => {
        Object.keys(obj).forEach((key) => {
            let val = obj[key]
            if(isNaN(val) && (key.indexOf('id') === 0 || key.indexOf('_id') > 0 || key.indexOf('soft_delete') === 0)){
                delete obj[key]
            }
            let isEmpty = (val == null)
            if(remove_emptyStrings){
                isEmpty = isEmpty || val == ''
            }
            isEmpty && delete obj[key]
        })
        return obj
    }
}

// exports.log_json =(json)=>{Logger.log(JSON.stringify(json, null, 4))}
