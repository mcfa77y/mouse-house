const express = require('express');

const router = express.Router();
const BlueBird = require('bluebird');
const isFalsey = require('falsey');
const fs = require('fs');
const csv = require('csvtojson');
const handlebars = require('handlebars');

BlueBird.promisifyAll(fs);

const breed_controller = require('../controllers/breed_controller');
const {
    select_json,
    log_json,
    getErrorGif,
} = require('./utils_routes');
const {
    get_breed_inputs,
    create_model,
} = require('./utils_breed_routes');

// list
router.get('/', (req, res) => {
    res.render('pages/grid/grid_list', {
        extra_js: ['grid_list.bundle.js'],
    });
});

// list
router.get('/view', (req, res) => {
    const cvs_uri = req.body.cvs_uri;
    const image_dir_uri = req.body.imageDirUri;

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

// create table from csv and image dir
router.post('/', (req, res) => {
    const cvs_uri = req.body.csvUri;
    const image_dir_uri = req.body.imageDirUri;

    // fs
    // .readdirSync(image_dir_uri)
    // .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    // .forEach((file) => {

    // });
    const source = fs.readFileSync(`${__dirname}/../views/partials/grid/grid_table.hbs`, 'utf-8');
    const html_template = handlebars.compile(source);
    csv()
        .fromFile(cvs_uri)
        .then((data) => {
            console.log(data);
            const column_headers = Object.keys(data[0]);
            const row_value_list = data.reduce((acc_array, row) => { acc_array.push(Object.values(row)); return acc_array; }, []);
            const html = html_template({ column_headers, row_value_list });
            res.status(200).send({
                success: true,
                data,
                html,
            });
        })
        .catch((err) => {
            console.error(err);
            res.send({
                success: false,
                err,
            });
        });


    // const model = create_model(req.body);
    // breed_controller.update(model)
    //     .then(() => {
    //         res.send({
    //             success: true
    //         });
    //     })
    //     .catch((err) => {
    //         res.status(500).send({
    //             success: false,
    //             err
    //         });
    //     });
});

module.exports = router;
