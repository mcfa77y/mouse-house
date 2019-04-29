const express = require('express');

const router = express.Router();
const BlueBird = require('bluebird');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const zeroFill = require('zero-fill');
const multer = require('multer');
// const helpers = require('handlebars-helpers');
const hbs = require('hbs');
// helpers.comparison({ handlebars });

const CONFIG_DIR = path.join(__dirname, '../config/');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, CONFIG_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}.json`);
    },
});
const upload = multer({ storage });

const PARTIALS_DIR = path.join(__dirname, '../views/partials/grid/');


BlueBird.promisifyAll(fs);


const {
    create_data_from_csv,
    find_row_by_index,
    file_exist,
    two_d_2_one_d, synthesize_rows, create_cell_name,
    get_config,
    add_config,
    save_config_to_disk,
    sanitize_config_name,
} = require('./utils_grid_routes');

// list
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


router.get('/config/:config_name', (req, res) => {
    res.send({ config: get_config(req, req.params.config_name) });
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
            csv_uri, image_dir_uri, prefix, extension, metadata_csv_uri,
        } = config[config_name];
        console.log(`config name: ${config_name}`);
        config_map[sanitize_config_name(config_name)] = {
            csv_uri, image_dir_uri, prefix, extension, metadata_csv_uri,
        };
    });

    req.session.config_map = config_map;
    save_config_to_disk(config_map, CONFIG_DIR);
    fs.unlinkSync(req.files.config_file[0].path);
    console.log(JSON.stringify(config_map, null, 2));
    res.send({ config_map });
});

// create card
router.post('/card', async (req, res) => {
    const {
        prefix, extension, index, metadata_csv_uri,
    } = req.body;
    const one_d_index = zeroFill(3, two_d_2_one_d(index));
    const file = `${prefix}${one_d_index}${extension}`;
    const data = await create_data_from_csv(metadata_csv_uri);

    const row = find_row_by_index(index, data);
    const row_zip = row.column_headers
        .reduce((acc, column_header, i) => {
            const class_name = column_header.trim().toLowerCase()
                .replace(' ', '_')
                .replace(/[(|)|.]/g, '');
            acc.push({ name: column_header, value: row.row_value_list[0][i].trim(), class_name });
            return acc;
        }, []);

    const cell_name = create_cell_name(row.column_headers, row.row_value_list[0]);
    const card_data = {
        image_uri: path.join('images', file),
        name: `${cell_name}: ${path.parse(file).name}`,
        id: path.parse(file).name,
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


const image_upload = upload.fields([
    { name: 'image_files', maxCount: 400 },
]);
// create table from csv and image dir
router.post('/table', image_upload, async (req, res) => {
    const config_map = add_config(req);
    save_config_to_disk(config_map, CONFIG_DIR);
    const {
        csv_uri, image_dir_uri, prefix, extension, metadata_csv_uri,
    } = req.body;
    Promise.all([file_exist(image_dir_uri, 'Image directory not found'),
    file_exist(csv_uri, 'Grid csv file not found'),
    file_exist(metadata_csv_uri, 'Metadata csv file not found')])
        .then(async () => {
            // copy images to public dir
            fs
                .readdirSync(image_dir_uri)
                .filter(file => path.parse(file).ext === extension)
                .forEach((file) => {
                    const dest_uri = path.join(__dirname, '..', 'public', 'images', file);
                    const src_uri = path.join(image_dir_uri, file);
                    fs.copyFileSync(src_uri, dest_uri);
                });

            const source = fs.readFileSync(`${PARTIALS_DIR}/grid_table.hbs`, 'utf-8');
            const grid_table_template = hbs.handlebars.compile(source);

            const { column_headers, row_value_list } = await create_data_from_csv(csv_uri);
            const {
                column_headers: meta_column_headers,
                row_value_list: meta_row_value_list,
            } = await create_data_from_csv(metadata_csv_uri);
            const new_row = synthesize_rows(row_value_list, meta_row_value_list, meta_column_headers);
            const dt = {
                column_headers,
                row_value_list: new_row,
                prefix,
                extension,
            };
            const html = grid_table_template(dt);
            res.status(200).send({
                success: true,
                html,
            });
        })
        .catch(({ message }) => {
            res.status(500).send({
                message,
            });
        });
});

module.exports = router;
