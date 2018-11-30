
import moment from "moment";
const isFalsey = require('falsey');
const Logger = require("bug-killer");
// String.prototype.toProperCase = function () {
//     return this.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
// };

export const option = (value:any, default_value = '', modifier_fn?: (x:any) => any) => {
    let result = '';
    if (!isFalsey(value)) {
        if (modifier_fn == undefined) {
            result = value;
        } else {
            result = modifier_fn(value);
        }
    } else {
        result = default_value;
    }
    return result;
};

export const format_date = (date: any, format = 'MM/DD/YYYY') => moment(date, moment.ISO_8601).format(format);


export function log_json(json: any) {
    let cache: any = [];
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
}
export function log(message: string) {
    Logger.log(message);
}
export function generate_uuid() {

}

export const option_date = (value: string) => option(value, '', format_date);
export const relative_time = (date: any): number => moment().diff(moment(date, moment.ISO_8601), 'week');



export function remove_empty(obj_original: any, remove_emptyStrings = false) {
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
}


// exports.log_json =(json)=>{Logger.log(JSON.stringify(json, null, 4))}
