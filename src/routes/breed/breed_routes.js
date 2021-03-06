const express = require('express');

const router = express.Router();
const BlueBird = require('bluebird');
const {falsy: isFalsey} = require('is_js');

const breed_controller = require('../../controllers/breed_controller');
const { select_json, log_json, getErrorGif } = require('../utils_routes');
const { get_breed_inputs, create_model } = require('./utils_breed_routes');

// list
router.get('/', (req, res) => {
    BlueBird.props({
        breeds: breed_controller.default.all_pretty(),
    })
        .then(({ breeds }) => {
            log_json(breeds);

            res.render('pages/breed/breed_list', {
                breeds,
                extra_js: ['breed_list.bundle.js'],
            });
        })
        .catch((error) => {
            getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl,
                });
            });
        });
});
router.get('/create', (req, res) => {
    BlueBird.props({
        input: get_breed_inputs(),
    })
        .then(({ input: { genotype, male_mice, female_mice } }) => {
            const gt = select_json(genotype);
            const mm = select_json(male_mice);
            const fm = select_json(female_mice);

            res.render('pages/breed/breed_create', {
                genotype: gt,
                male_mice: mm,
                female_mice: fm,
                extra_js: ['breed_create.bundle.js'],
            });
        })
        .catch((error) => {
            getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl,
                });
            });
        });
});

router.get('/:id_alias', (req, res) => {
    BlueBird.props({
        input: get_breed_inputs(),
        breed: breed_controller.default.by_id_alias(req.params.id_alias),
    })
        .then(({ input, breed }) => {
            const genotype = select_json(input.genotype);
            const male_mice = select_json(input.male_mice);
            const female_mice = select_json(input.female_mice);
            log_json(breed);

            res.render('pages/breed/breed_update', {
                genotype,
                male_mice,
                female_mice,
                breed,
                extra_js: ['breed_update.bundle.js'],
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ success: false, err });
        });
});

router.delete('/:id', (req, res) => {
    const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;

    const rm_promises = rm_ids.split(',').map(id => breed_controller.default.delete(id));

    return Promise.all(rm_promises)
        .then(() => {
            res.send({
                success: true,
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err,
            });
        });
});

router.put('/', (req, res) => {
    const model = create_model(req.body);
    breed_controller.default.insert(model)
        .then(() => {
            res.send({
                success: true,
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err,
            });
        });
});

// update
router.post('/', (req, res) => {
    const model = create_model(req.body);
    breed_controller.default.update(model)
        .then(() => {
            res.send({ success: true });
        })
        .catch((err) => {
            res.status(500).send({ success: false, err });
        });
});

module.exports = router;
