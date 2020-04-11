import multer from 'multer';
import { StorageEngine } from 'multer';
import { RedisClient } from 'redis';
import { join, parse } from 'path';
import { Request } from 'express';

const redis = require("redis");

// make sure this folder exists on root dir of project
const TMP_DIR = join(__dirname, '../../../tmp');

const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, TMP_DIR)
    },
    filename: function (req: Request, file, cb) {
        const x = parse(file.originalname);
        cb(null, x.name + '-' + Date.now() + x.ext)
    }
})

const upload = multer({ storage });

export const upload_fields = upload.fields([
    { name: 'platemap_csv_files', maxCount: 400 },
    { name: 'crc_csv', maxCount: 1 },
    { name: 'images_csv', maxCount: 1 },
]);



const redis_config = {
    url: process.env.LOCAL_REDIS_URL,
    retry_strategy: function (options) {
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
export const client: RedisClient = redis.createClient(redis_config);
console.log('\nredis url: ' + redis_config.url);

client.on("error", function (error) {
    console.error(error);
});

// export client;
