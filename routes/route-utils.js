const Logger = require('bug-killer');
const moment = require('moment');
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
module.exports = {
    logJSON :(json)=>{Logger.log(JSON.stringify(json, null, 4))},
    
    selectJSON: (items, id, description='')=>{
        if(description === ''){
            description = id.toProperCase().replace('_', ' ')
        }
        return {id, description, items}
    },

    relativeTime: (date)=>{
    	return moment(date, moment.ISO_8601).fromNow()
    }
}

// exports.logJSON =(json)=>{Logger.log(JSON.stringify(json, null, 4))}

