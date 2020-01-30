import express from 'express';
// import { falsy as isFalsey } from 'is_js';

// import { fstat, readFileSync } from 'fs';

// import { getErrorGif } from './utils_routes';
// import experiment_controller from '../controllers/experiment_controller';

import {upload_fields, 
    process_csvs, 
    transform_platemap_data} from './util_upload_routes';


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
    process_csvs(platemap_csv_files, transform_platemap_data);
    
    res.send({ success: true });
});

// module.exports = router;
export default router;