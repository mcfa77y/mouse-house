const express = require('express');

const router = express.Router();
const BlueBird = require('bluebird');
const fs = require('fs');
const path = require('path');
const zeroFill = require('zero-fill');
const multer = require('multer');
// const helpers = require('handlebars-helpers');
const hbs = require('hbs');
// helpers.comparison({ handlebars });


const {
    create_data_from_csv,
    find_row_by_index,
    two_d_2_one_d, synthesize_rows, create_cell_name,
    get_config,
    add_config,
    save_config_to_disk,
    sanitize_config_name,
} = require('./utils_grid_routes');

const CONFIG_DIR = path.join(__dirname, '../config/');
const PUBLIC_DIR = path.join(__dirname, '../public/experiments');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const url = req.originalUrl;
        if (url === '/grid/config') {
            cb(null, CONFIG_DIR);
        } else if (url === '/grid/table') {
            const foo = path.join(PUBLIC_DIR, sanitize_config_name(req.body.config_name_description));
            try {
                fs.mkdirSync(foo);
            } catch (err) {
                // console.error(err);
            }
            cb(null, foo);
        }
    },
    filename: (req, file, cb) => {
        const url = req.originalUrl;
        if (url === '/grid/config') {
            cb(null, `${file.fieldname}_${Date.now()}.json`);
        } else if (url === '/grid/table') {
            const new_name = `${file.originalname}`;
            cb(null, new_name);
        }
    },
});
const upload = multer({ storage });

const PARTIALS_DIR = path.join(__dirname, '../views/partials/grid/');


BlueBird.promisifyAll(fs);


router.get('/', (req, res) => {
    let config_map = [];
    if (req.session.config_map) {
        ({ config_map } = req.session);
    } else {
        req.session.config_map = config_map;
        // res.cookie('config_map', config_map);
    }
    const config_name_select_list = Object.keys(config_map)
        .map(config_name => ({ id: `${config_name}`, description: `${config_name}` }));
    res.render('pages/grid/grid_list', {
        extra_js: ['grid_list.bundle.js'],
        config_name_select_list,
    });
});

router.get('/:config_name', async (req, res) => {
    let config_map = [];
    if (req.session.config_map) {
        ({ config_map } = req.session);
    } else {
        req.session.config_map = config_map;
        // res.cookie('config_map', config_map);
    }
    const config_name_select_list = Object.keys(config_map)
        .map(config_name => ({ id: `${config_name}`, description: `${config_name}` }));

    const config = get_config(req, req.params.config_name);

    const config_name_description = req.params.config_name;

    const {
        grid_data_csv_uri, metadata_csv_uri,
    } = config;

    const source = fs.readFileSync(`${PARTIALS_DIR}/grid_table.hbs`, 'utf-8');
    const grid_table_template = hbs.handlebars.compile(source);

    const { column_headers, row_value_list } = await create_data_from_csv(grid_data_csv_uri);
    const {
        column_headers: meta_column_headers,
        row_value_list: meta_row_value_list,
    } = await create_data_from_csv(metadata_csv_uri);
    const new_row = synthesize_rows(row_value_list, meta_row_value_list, meta_column_headers);
    const dt = {
        column_headers,
        row_value_list: new_row,
    };
    const table_html = grid_table_template(dt);
    res.render('pages/grid/grid_list', {
        extra_js: ['grid_list.bundle.js'],
        config_name_select_list,
        table_html,
        config_name_description,
    });
});


router.get('/config/:config_name', (req, res) => {
    const config = get_config(req, req.params.config_name);
    res.status(200).send({ config });
});

const cpUpload = upload.fields([
    { name: 'config_file', maxCount: 1 },
]);

router.post('/config/', cpUpload, (req, res) => {
    let config_map = {};
    if (req.session.config_map) {
        ({ config_map } = req.session);
    }
    const uploaded_file_uri = req.files.config_file[0].path;
    const config = JSON.parse(fs.readFileSync(uploaded_file_uri));

    Object.keys(config).forEach((config_name) => {
        const {
            grid_data_csv_uri, metadata_csv_uri, tags, image_path_obj,
        } = config[config_name];
        console.log(`config name: ${config_name}`);
        config_map[sanitize_config_name(config_name)] = {
            grid_data_csv_uri, metadata_csv_uri, tags, image_path_obj,
        };
    });
    config_map = Object.assign({}, config_map);
    req.session.config_map = config_map;
    save_config_to_disk(config_map, CONFIG_DIR);
    fs.unlinkSync(req.files.config_file[0].path);
    console.log(JSON.stringify(config_map, null, 2));
    res.send({ config_map });
});

router.post('/tags/', cpUpload, (req, res) => {
    const config_map = add_config(req);
    save_config_to_disk(config_map, CONFIG_DIR);
    res.status(200).send({
        success: true,
    });
});

const any_upload_fields = upload.any();
// create card
router.post('/card', any_upload_fields, async (req, res) => {
    const {
        index, config_name_description,
    } = req.body;
    const { image_path_obj, metadata_csv_uri } = get_config(req, config_name_description);
    const one_d_index = zeroFill(3, two_d_2_one_d(index));
    const filename = image_path_obj.name.slice(0, -3) + one_d_index + image_path_obj.ext;
    const file_path = image_path_obj.dir.replace('/', '');
    const file = path.join(file_path, filename);
    const data = await create_data_from_csv(metadata_csv_uri);

    const row = find_row_by_index(index, data);
    const row_zip = row.column_headers
        .reduce((acc, column_header, i) => {
            const class_name = column_header.trim().toLowerCase()
                .replace(/ /g, '_')
                .replace(/[(|)|.]/g, '');
            acc.push({ name: column_header, value: row.row_value_list[0][i].trim(), class_name });
            return acc;
        }, []);

    const cell_name = create_cell_name(row.column_headers, row.row_value_list[0]);
    const card_data = {
        image_uri: file,
        name: `${cell_name}: ${filename}`,
        id: filename,
        row_zip,
        column_headers: data.column_headers,
    };

    const source = fs.readFileSync(`${PARTIALS_DIR}/grid_card.hbs`, 'utf-8');
    const html_template = hbs.handlebars.compile(source);
    const html = html_template(card_data);

    // res.render('pages/grid/grid_view', dt);
    res.status(200).send({
        html,
    });
});


const public_upload_fields = upload.fields([
    { name: 'image_files', maxCount: 400 },
    { name: 'grid_data_csv', maxCount: 1 },
    { name: 'metadata_csv', maxCount: 1 },
]);

// create table from csv and image dir
router.post('/table', public_upload_fields, async (req, res) => {
    const config_map = add_config(req);
    save_config_to_disk(config_map, CONFIG_DIR);
    const {
        config_name_description,
    } = req.body;
    const {
        grid_data_csv_uri, metadata_csv_uri, tags,
    } = config_map[config_name_description];

    const source = fs.readFileSync(`${PARTIALS_DIR}/grid_table.hbs`, 'utf-8');
    const grid_table_template = hbs.handlebars.compile(source);

    const { column_headers, row_value_list } = await create_data_from_csv(grid_data_csv_uri);
    const {
        column_headers: meta_column_headers,
        row_value_list: meta_row_value_list,
    } = await create_data_from_csv(metadata_csv_uri);
    const new_row = synthesize_rows(row_value_list, meta_row_value_list, meta_column_headers);
    const dt = {
        column_headers,
        row_value_list: new_row,
    };
    const html = grid_table_template(dt);
    res.status(200).send({
        success: true,
        html,
        config_name_description,
        tags,
    });
});

module.exports = router;
