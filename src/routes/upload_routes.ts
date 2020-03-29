import express from 'express';

import UIDGenerator from 'uid-generator';

import { log_json } from './utils_routes'
import { falsy } from 'is_js';


import {
    upload_fields
} from './util_upload_common_routes';

import {
    process_platemap_csv,
} from './util_upload_platemap_routes';

import { process_crc_csv } from './util_upload_crc_routes';

import { client } from './util_upload_common_routes';

const router = express.Router();
const uidgen = new UIDGenerator()


// upload page
router.get('/', async (req, res) => {
    res.render('pages/upload/upload', {
        extra_js: ['upload.bundle.js'],
    });
});

// upload action
// ajax response
router.post('/', upload_fields, async (req, res) => {
    const token = await uidgen.generate();
    // const model = upload_model(req.files);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const platemap_csv_files: Express.Multer.File[] = files["platemap_csv_files"];
    if (!falsy(platemap_csv_files) && platemap_csv_files.length > 0) {
        console.log(`platemap_csv_files: ${JSON.stringify(platemap_csv_files, null, 2)}`);
        process_platemap_csv(platemap_csv_files, token);
    }

    const crc_csv_files: Express.Multer.File[] = files["crc_csv"];
    if (!falsy(crc_csv_files) && crc_csv_files.length > 0) {
        console.log(`crc_csv_files: ${JSON.stringify(crc_csv_files, null, 2)}`);
        process_crc_csv(crc_csv_files[0], token);
    }
    // console.log(`crc_csv_files: ${JSON.stringify(crc_csv_file, null, 2)}`);
    // process_crc_csv(crc_csv_file[0], token);
    res.send({ success: true, token });
});

// upload progress 
// use token issued during upload to return progress
// return json
router.post('/progress', async (req, res) => {
    // const model = upload_model(req.files);
    const { token } = req.body;
    if (token == undefined) {
        res.status(422).send({ message: "invalid token" })
    }
    else {

        try {

            client.get(token, (err, reply) => {
                if (err) {
                    console.log("redis get error: " + err)
                }
                // console.log("\n\n\ntoken" + reply);

                log_json(reply);
                res.send({ token, progress: JSON.parse(reply) });
            })
        }
        catch (err) {
            console.error(err);
        }
    }
});

// module.exports = router;
export default router;