const Logger = require('bug-killer');
const moment = require('moment');
const cool = require('cool-ascii-faces');

const { falsy: isFalsey } = require('is_js');
const rp = require('request-promise');
const _ = require('underscore');

const CREDENTIALS = require('../config/credentials.json');

export const log_json = (json) => {
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
};

export const sanitize_string = (name) => name.trim().replace(' ', '_').replace('(', '').replace(')', '');

export const select_json = (items) => {
    const result = items.map((x) => {
        const description = isFalsey(x.description) ? x.id : x.description;
        return { id: `${x.id}`, description: `${description}` };
    });
    return {
        items: result,
    };
};
export const format_date = (date) => moment(date, moment.ISO_8601);
export const today = (format = 'MM/DD/YYYY') => moment().format(format);
export const relative_time = (date) => moment(date, moment.ISO_8601).fromNow();
export const cool_face = () => cool();
export const move_note = (req) => {
    const note = isFalsey(req.body.note) ? '' : req.body.note;
    req.body.note = {};
    req.body.note.text = note;
};
export const build_note = (_model) => {
    const note = isFalsey(_model.note) ? '' : _model.note;
    return { text: note };
};
export const getErrorGif = () => {
    const options = {
        uri: 'http://api.giphy.com/v1/gifs/search',
        qs: {
            q: 'zoidberg',
            api_key: CREDENTIALS.giphy.api_key,

        },
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true, // Automatically parses the JSON string in the response
    };
    return rp(options)
        .then((json) => {
            const randomIndex = _.random(0, json.data.length);
            return json.data[randomIndex].images.original.url;
        })
        .catch(() => 'https://media3.giphy.com/media/OOYbBXVUDzBCw/giphy.gif');
};

// exports.log_json =(json)=>{Logger.log(JSON.stringify(json, null, 4))}
