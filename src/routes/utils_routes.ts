import  Moment from 'moment';

const  Logger = require('bug-killer');
const  cool = require('cool-ascii-faces');
const  readJson = require('r-json');
const  isFalsey = require('falsey');
import rp from 'request-promise';
import { random } from 'underscore';

import { Request } from 'express';

const CREDENTIALS = readJson(`${__dirname}/../config/credentials.json`);
// String.prototype.toProperCase = function () {
//     return this.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
// };
export const utils = {
    log_json: (json: any) => {
        let cache:any = [];
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
    reshape_for_select: (model?:any) => ({ id: model.id, description: model.id_alias }),
    select_json: (items: any[], reshape_fn:any = null) => {
        let tmp_items = items;
        if (!isFalsey(reshape_fn)) {
            tmp_items = items.map(reshape_fn);
        }
        const result = tmp_items.map((x) => {
            const description = isFalsey(x.description) ? x.id : x.description;
            return { id: `${x.id}`, description: `${description}` };
        });
        return {
            items: result,
        };
    },
    format_date: (date: any) => Moment(date, Moment.ISO_8601),
    today: (format = 'MM/DD/YYYY') => Moment().format(format),
    relative_time: (date: any) => Moment(date, Moment.ISO_8601).fromNow(),
    cool_face: () => cool(),
    move_note: (req: Request) => {
        const note = isFalsey(req.body.note) ? '' : req.body.note;
        req.body.note = {};
        req.body.note.text = note;
    },
    build_note: (_model: any) => {
        const note = isFalsey(_model.note) ? '' : _model.note;
        return { text: note };
    },
    getErrorGif: async () => {
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
        return await rp(options)
            .then((json: any) => {
                const randomIndex = random(0, json.data.length);
                return json.data[randomIndex].images.original.url;
            })
            .catch(() => 'https://media3.giphy.com/media/OOYbBXVUDzBCw/giphy.gif');
    },
};

// exports.log_json =(json)=>{Logger.log(JSON.stringify(json, null, 4))}
