import express from 'express';

import UIDGenerator from 'uid-generator';

import {log_json} from './utils_routes'

import {
    upload_fields,
    process_platemap_csv,
    test_poll
} from './util_upload_routes';
import { RedisClient } from 'redis';

const redis = require("redis");
const client: RedisClient = redis.createClient(process.env.REDIS_URL);

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
    // const model = upload_model(req.files);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const platemap_csv_files: Express.Multer.File[] = files["platemap_csv_files"];
    console.log(`platemap_csv_files: ${JSON.stringify(platemap_csv_files, null, 2)}`);
    const token = await uidgen.generate();
    process_platemap_csv(platemap_csv_files, token);
    // test_poll(token);
    res.send({ success: true, token });
});

// upload progress 
// use token issued during upload to return progress
// return json
router.post('/progress', async (req, res) => {
    // const model = upload_model(req.files);
    const {token} = req.body;
    client.get(token, (err, reply) => {
        if(err){
            console.log("redis get error")
        }
        res.send({ token, progress: JSON.parse(reply) });
    })
});

// module.exports = router;
export default router;