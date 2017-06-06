const Logger = require('bug-killer');
const moment = require('moment');
String.prototype.toProperCase = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
module.exports = {
    logJSON: (json) => {
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

    selectJSON: (items, id, description = '') => {
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

    relativeTime: (date) => {
        return moment(date, moment.ISO_8601).fromNow()
    },

    stringTime: (date) => {
        return moment(date, moment.ISO_8601).format('MM/DD/YY')
    },

    removeEmpty : (obj, removeEmptyStrings) => {
        Object.keys(obj).forEach((key) => {
            let val = obj[key]
            if(isNaN(val) && (key.indexOf('id') === 0 || key.indexOf('_id') > 0 || key.indexOf('soft_delete') === 0)){
                delete obj[key]
            }
            let isEmpty = (val == null)
            if(removeEmptyStrings){
                isEmpty = isEmpty || val == ''
            }
            isEmpty && delete obj[key]
        })
        return obj
    }
}

// exports.logJSON =(json)=>{Logger.log(JSON.stringify(json, null, 4))}
