const Logger = require('bug-killer');
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
    }
}

// exports.logJSON =(json)=>{Logger.log(JSON.stringify(json, null, 4))}

