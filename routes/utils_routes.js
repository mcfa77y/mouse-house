const Logger = require('bug-killer');
const moment = require('moment');
const cool = require('cool-ascii-faces');
const readJson = require('r-json');
const isFalsey = require('falsey');
const rp = require('request-promise')
const _ = require('underscore')

const CREDENTIALS = readJson(`${__dirname}/../config/credentials.json`);
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

    select_json: (items, _id, _description = '') => {
        const result = items.map(x => {
            const description = isFalsey(x.description) ? x.id : x.description
            return { id: x.id, description }
        })
        return {
            items: result
        }
    },
    format_time: (date) => {
        return moment(date, moment.ISO_8601)
    },

    relative_time: (date) => {
        return moment(date, moment.ISO_8601).fromNow()
    },
    cool_face: () => {
        return cool();
    },
    move_note: (req) => {
        const note = isFalsey(req.body.note) ? '' : req.body.note
        req.body.note = {}
        req.body.note.text = note
    },
    getErrorGif: () => {
        const options = {
            uri: 'http://api.giphy.com/v1/gifs/search',
            qs: {
                q: 'zoidberg',
                api_key: CREDENTIALS.giphy.api_key

            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(options)
            .then((json) => {
                const randomIndex = _.random(0, json.data.length);
                return json.data[randomIndex].images.original.url;
            })
            .catch((error) => {
                return "https://media3.giphy.com/media/OOYbBXVUDzBCw/giphy.gif"
            })

    }
}

// exports.log_json =(json)=>{Logger.log(JSON.stringify(json, null, 4))}