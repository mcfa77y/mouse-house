const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')
const isFalsey = require('falsey');

const breed_controller = require('../controllers/breed_controller')
const enum_controller = require('../controllers/enum_controller')
const mouse_controller = require('../controllers/mouse_controller')
const utils = require('./utils_routes')

function _get_breed_inputs() {
    return BlueBird.props({
        genotype: enum_controller.by_type('MOUSE_GENOTYPE'),
        male_mice: mouse_controller.by_sex('male'),
        female_mice: mouse_controller.by_sex('female')
    })
}

router.get('/', function(req, res) {
    BlueBird.props({
            breeds: breed_controller.all_pretty()
        })
        .then(({ breeds }) => {
            utils.log_json(breeds)

            res.render('pages/breed/breed_list', {
                breeds,
                extra_js: ['breed_list.bundle.js']
            })
        })
        .catch(error => {
            utils.getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl
                })
            })
        })


});
router.get('/create', function(req, res) {
    BlueBird.props({
            input: _get_breed_inputs()
        })
        .then(({ input: {genotype, male_mice, female_mice} }) => {
            let gt = utils.select_json(genotype, 'mouse_genotype', 'Genotype')
            let mm = utils.select_json(male_mice, 'male_mouse')
            let fm = utils.select_json(female_mice, 'female_mouse')

            res.render('pages/breed/breed_create', {
                genotype: gt,
                male_mouse: mm,
                female_mouse: fm,
                extra_js: ['breed_create.bundle.js']
            })
        })
        .catch(error => {
            utils.getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl
                })
            })
        })
});

router.get('/:id_alias', function(req, res) {
    BlueBird.props({
            input: _get_breed_inputs(),
            breed: breed_controller.by_id_alias(req.params.id_alias)
        })
        .then(({ input, breed }) => {
            let genotype = utils.select_json(input.genotype, 'mouse_genotype', 'Genotype')
            let male_mice = utils.select_json(input.male_mice, 'male_mouse')
            let female_mice = utils.select_json(input.female_mice, 'female_mouse')
            utils.log_json(breed)
            
            res.render('pages/breed/breed_update', {
                genotype,
                male_mice,
                female_mice,
                breed,
                extra_js: ['breed_update.bundle.js']
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({ success: false, err })
        })
});

router.delete('/:id', function(req, res) {
    const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias

    const rm_promises = rm_ids.split(',').map(id => {
        breed_controller.delete(id)
    })

    return Promise.all(rm_promises)
        .then((x) => {
            res.send({
                success: true
            })
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err
            })
        })
});

router.put('/', function(req, res) {
    utils.move_note(req)
    utils.log_json(req.body)
    //let model = new cage_model(req.body)
    breed_controller.insert(req.body).then((x) => {
            res.send({
                success: true,
                x: x
            })
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err
            })
        })
});

router.post('/', function(req, res) {
    utils.move_note(req)
    utils.log_json(req.body)
    breed_controller.update(req.body).then((x) => {
            res.send({ success: true })
        })
        .catch((err) => {
            res.status(500).send({ success: false, err })
        })

});

module.exports = router;