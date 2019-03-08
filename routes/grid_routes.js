const express = require('express');

const router = express.Router();
const BlueBird = require('bluebird');
const isFalsey = require('falsey');
const fs = require('fs');
const csv = require('csvtojson');
const handlebars = require('handlebars');
const path = require('path');

const PARTIALS_DIR = path.join(__dirname, '../views/partials/grid/');
const DIGITS_REGEX = /\d+/;

BlueBird.promisifyAll(fs);

const stat = BlueBird.promisify(fs.stat);

const {
    select_json,
    log_json,
    getErrorGif,
} = require('./utils_routes');

const {
    create_data_from_csv,
    find_row_by_index,
    file_exist,
} = require('./utils_grid_routes');

// list
router.get('/', (req, res) => {
    res.render('pages/grid/grid_list', {
        extra_js: ['grid_list.bundle.js'],
    });
});

// list
router.get('/view', (req, res) => {
    res.render('pages/grid/grid_view', {
        extra_js: ['grid_view.bundle.js'],
    });
});

router.get('/create', (req, res) => {
    // BlueBird.props({
    //         input: get_breed_inputs(),
    //     })
    //     .then(({
    //         input: {
    //             genotype,
    //             male_mice,
    //             female_mice
    //         }
    //     }) => {
    //         const gt = select_json(genotype, 'mouse_genotype', 'Genotype');
    //         const mm = select_json(male_mice, 'male_mouse');
    //         const fm = select_json(female_mice, 'female_mouse');

    //         res.render('pages/breed/breed_create', {
    //             genotype: gt,
    //             male_mice: mm,
    //             female_mice: fm,
    //             extra_js: ['breed_create.bundle.js'],
    //         });
    //     })
    //     .catch((error) => {
    //         getErrorGif().then((errorImageUrl) => {
    //             res.render('error', {
    //                 error,
    //                 errorImageUrl,
    //             });
    //         });
    //     });
});

router.get('/:id_alias', (req, res) => {
    // BlueBird.props({
    //         input: get_breed_inputs(),
    //         breed: breed_controller.by_id_alias(req.params.id_alias),
    //     })
    //     .then(({
    //         input,
    //         breed
    //     }) => {
    //         const genotype = select_json(input.genotype, 'mouse_genotype', 'Genotype');
    //         const male_mice = select_json(input.male_mice, 'male_mouse');
    //         const female_mice = select_json(input.female_mice, 'female_mouse');
    //         log_json(breed);

    //         res.render('pages/breed/breed_update', {
    //             genotype,
    //             male_mice,
    //             female_mice,
    //             breed,
    //             extra_js: ['breed_update.bundle.js'],
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.status(500).send({
    //             success: false,
    //             err
    //         });
    //     });
});

router.delete('/:id', (req, res) => {
    // const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;

    // const rm_promises = rm_ids.split(',').map(id => breed_controller.delete(id));

    // return Promise.all(rm_promises)
    //     .then(() => {
    //         res.send({
    //             success: true,
    //         });
    //     })
    //     .catch((err) => {
    //         res.status(500).send({
    //             success: false,
    //             err,
    //         });
    //     });
});

router.put('/', (req, res) => {
    // const model = create_model(req.body);
    // breed_controller.insert(model)
    //     .then(() => {
    //         res.send({
    //             success: true,
    //         });
    //     })
    //     .catch((err) => {
    //         res.status(500).send({
    //             success: false,
    //             err,
    //         });
    //     });
});
// create card
router.post('/card', async (req, res) => {
    const {
        prefix, extension, index, metadata_csv_uri,
    } = req.body;

    const file = `${prefix}${index}${extension}`;
    const data = await create_data_from_csv(metadata_csv_uri);

    const row = find_row_by_index(index, data);
    const row_zip = row.column_headers
        .reduce((acc, column_header, i) => {
            acc.push({ name: column_header, value: row.row_value_list[0][i] });
            return acc;
        }, []);

    const card_data = {
        image_uri: path.join('images', file),
        name: path.parse(file).name,
        id: path.parse(file).name.match(DIGITS_REGEX)[0],
        row_zip,
        column_headers: data.column_headers,
    };

    const source = fs.readFileSync(`${PARTIALS_DIR}/grid_card.hbs`, 'utf-8');
    const html_template = handlebars.compile(source);
    const html = html_template(card_data);

    // res.render('pages/grid/grid_view', dt);
    res.status(200).send({
        html,
    });
});
// create table from csv and image dir
router.post('/table', async (req, res) => {
    const {
        csv_uri, image_dir_uri, prefix, extension, metadata_csv_uri,
    } = req.body;
      Promise.all([file_exist(image_dir_uri, 'Image directory not found'), file_exist(csv_uri, 'Grid csv file not found'), file_exist(metadata_csv_uri, 'Metadata csv file not found')])
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
            const html_template = handlebars.compile(source);

            const { column_headers, row_value_list } = await create_data_from_csv(csv_uri)

            const dt = {
                column_headers,
                row_value_list,
                prefix,
                extension,
            };
            const html = html_template(dt);
            res.status(200).send({
                success: true,
                html,
            });
        })
        .catch(({ message }) => {
            res.status(500).send({
                success: false,
                message,
            });
        });
});

module.exports = router;
