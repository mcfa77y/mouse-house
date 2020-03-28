import express from 'express';

import UIDGenerator from 'uid-generator';

import {log_json} from './utils_routes'

import {
    upload_fields,
    process_platemap_csv,
} from './util_upload_platemap_routes';
import { RedisClient } from 'redis';
import { process_crc_csv } from './util_upload_crc_routes';

const redis = require("redis");


// const client: RedisClient = redis.createClient(process.env.REDIS_URL);
const redis_config = {
    url : process.env.LOCAL_REDIS_URL,
    retry_strategy: function(options) {
          if (options.error && options.error.code === "ECONNREFUSED") {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error("The server refused the connection");
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error("Retry time exhausted");
          }
          if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
          }
          // reconnect after
           return Math.min(options.attempt * 100, 3000);
        }
}
const client: RedisClient = redis.createClient(redis_config);

console.log('\nredis url: ' + client.address);

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
    if (platemap_csv_files != undefined && platemap_csv_files.length > 0){
        console.log(`platemap_csv_files: ${JSON.stringify(platemap_csv_files, null, 2)}`);
        process_platemap_csv(platemap_csv_files, token);
    }
    
    // const crc_csv_file: Express.Multer.File[] = files["crc_csv"];
    // console.log(`crc_csv_files: ${JSON.stringify(crc_csv_file, null, 2)}`);
    // process_crc_csv(crc_csv_file[0], token);
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
            console.log("redis get error: " + err)
        }
        // console.log("\n\n\ntoken" + reply);
        
        log_json(reply);
        res.send({ token, progress: JSON.parse(reply) });
    })
});

// module.exports = router;
export default router;