const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')

const breed_controller = require('../controllers/enum_controller')
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
            input: _get_breed_inputs()
        })
        .then(({ input }) => {
            let gt = utils.select_json(input.genotype, 'mouse_genotype', 'Genotype')
            let mm = utils.select_json(input.male_mice, 'male_mouse')
            let fm = utils.select_json(input.female_mice, 'female_mouse')

            res.render('pages/breed/breed_list', {
                genotype: gt,
                male_mouse: mm,
                female_mouse: fm,
                extra_js: ['cs-breed']
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
                extra_js: ['cs-breed']
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
            input: _get_cage_inputs(),
            breed: breed_controller.by_id_alias(req.params.id_alias)
        })
        .then(({ input, breed }) => {
            let genotype = utils.select_json(input.genotype, 'mouse_genotype', 'Genotype')
            let male_mouse = utils.select_json(input.male_mice, 'male_mouse')
            let female_mouse = utils.select_json(input.female_mice, 'female_mouse')
            utils.log_json(breed)

            res.render('pages/breed/breed_create', {
                genotype,
                male_mouse,
                female_mouse,
                breed,
                extra_js: ['cs-breed']
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({ success: false, err })
        })
});

router.delete('/:id', function(req, res) {
    breed_controller.delete(req.params.id).then((x) => {
            res.send({ success: true })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({ success: false, err })
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