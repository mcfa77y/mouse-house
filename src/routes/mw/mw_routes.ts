import express from 'express';
import Axios from 'axios';
import { get_level2_mods } from './mw_logic_routes';
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
const hbs = require('hbs');

const router = express.Router();
const PARTIALS_DIR = path.join(__dirname, '../../../views/partials/mw/');

const RESULTS_SOURCE = readFileSync(path.join(PARTIALS_DIR, 'mw_result_ul.hbs'), 'utf-8');
const RESULTS_HTML_TEMPLATE = hbs.handlebars.compile(RESULTS_SOURCE);

const RESULT_ROOT_MOD_SELECT_HTML_TEMPLATE = hbs.handlebars.compile(readFileSync(path.join(PARTIALS_DIR, 'mw_result_root_mod_select.hbs'), 'utf-8'));
// upload page
router.get('/', async (req, res) => {
    res.render('pages/mw/mw', {
        extra_js: ['mw.bundle.js'],
    });
});

// upload action
// ajax response
// const http = require('follow-redirects').http;

export function json_string(json) {
    let cache = [];
    const result = JSON.stringify(json, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return undefined;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, 4);
    cache = null; // Enable garbage collection
    return result;
}

router.post('/', async (req, res) => {
    const uri = "http://reswebappdev303.gene.com:21135/tapir-helm2-service/calculation/antibodyModificationMolecularWeights"

    const mod_mw = await Axios.post(uri, req.body)
        .then((resp) => {
            console.log(`${json_string(resp)}`);
            if (resp.data.successful != undefined && !resp.data.successful) {
                console.log(resp.data.statusMessage);
                return {
                    success: false,
                    message: resp.data.statusMessage
                }
            }
            // res.send(resp.data.object.modificationmolweights)
            return resp.data.object.modificationmolweights;
        })
        .catch((err) => {
            console.error(err);
            return { success: false, message: err };
        });
    // writeFileSync('mod_mw.json', JSON.stringify(mod_mw, null, 1))
    // const mod_mw = JSON.parse(readFileSync('mod_mw.json', 'utf-8'))
    if (mod_mw.success != undefined && !mod_mw.success) {
        
        res.status(200).send({
            success: false,
            message: mod_mw.message
        });
    }
    else {
        const { html_data, sorted_mod_mw_map } = get_level2_mods(mod_mw)
        const results_html = RESULT_ROOT_MOD_SELECT_HTML_TEMPLATE({ html_data })
        res.status(200).send({
            html: results_html,
            sorted_mod_mw_map
        });
    }

});


// module.exports = router;
export default router;