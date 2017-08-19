const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')

const enum_controller = require('../controllers/enum_controller')
const mouse_controller = require('../controllers/mouse_controller')
const utils = require('./utils_routes')

router.get('/', function(req, res) {
    BlueBird.props({
            genotype: enum_controller.by_type('MOUSE_GENOTYPE'),
            male_mice: mouse_controller.by_sex('male'),
            female_mice: mouse_controller.by_sex('female')
        })
        .then(({ genotype, male_mice, female_mice }) => {
            let gt = utils.select_json(genotype, 'mouse_genotype', 'Genotype')
            let mm = utils.select_json(male_mice, 'male_mouse')
            let fm = utils.select_json(female_mice, 'female_mouse')

            res.render('pages/breed/list', { genotype: gt, 
                male_mouse: mm, female_mouse: fm })
        })


});

module.exports = router;
