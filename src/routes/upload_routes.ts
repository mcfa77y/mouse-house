import express from 'express';
import {
    upload_fields,
    process_platemap_csv
} from './util_upload_routes';

const router = express.Router();

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
    process_platemap_csv(platemap_csv_files);
    var data = '';

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {
        console.log('File uploaded');
        res.writeHead(200);
        res.end();
    });
    // res.send({ success: true });
});

// module.exports = router;
export default router;