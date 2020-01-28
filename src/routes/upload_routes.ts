import express from 'express';
import { falsy as isFalsey } from 'is_js';
import multer from 'multer';
import { join, parse } from 'path';

import { select_json, getErrorGif } from './utils_routes';
import project_controller from '../controllers/project_controller';
import experiment_controller from '../controllers/experiment_controller';


const TMP_DIR = join(__dirname, '../../tmp');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, TMP_DIR)
    },
    filename: function (req, file, cb) {
        const x = parse(file.originalname);
        cb(null, x.name + '-' + Date.now() + x.ext)
    }
})
const upload = multer({ storage });
const router = express.Router();

// common stuff
function create_model({ name, note, experiment_ids }: { name: string, note: string, experiment_ids: string }) {
    return {
        name,
        note,
        experiments: experiment_ids.split(',').map(id => parseInt(id)),
    };
}

function upload_model({ id, name, note, experiment_ids }: { id: string, name: string, note: string, experiment_ids: string }) {
    return {
        id,
        name,
        note,
        experiments: experiment_ids.split(',').map(id => parseInt(id)),
    };
}

const upload_fields = upload.fields([
    { name: 'platemap_csv_files', maxCount: 400 },
    { name: 'crc_csv', maxCount: 1 },
    { name: 'images_zip', maxCount: 1 },
]);
// end common stuff

// upload page
router.get('/', async (req, res) => {
    res.render('pages/upload/upload', {
        extra_js: ['upload.bundle.js'],
    });
});

// upload action
// ajax response
router.post('/', upload_fields, (req, res) => {
    const model = upload_model(req.files);
    console.log(`model: ${JSON.stringify(model, null, 2)}`);
    res.send({ success: true });
});

// module.exports = router;
export default router;