const Logger = require('bug-killer');
const moment = require('moment');
const cool = require('cool-ascii-faces');

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

    select_json: (items, id, description = '') => {
        if (description === '') {
            description = id.toProperCase()
                .replace('_id', '')
                .replace('_', ' ')
        }
        return {
            items
        }
    },
    format_time: (date) => {
        return moment(date, moment.ISO_8601)
    },

    relative_time: (date) => {
        return moment(date, moment.ISO_8601).fromNow()
    },
    cool_face:() => {
        return cool();
    }
}

// exports.log_json =(json)=>{Logger.log(JSON.stringify(json, null, 4))}
