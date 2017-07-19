const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse'))
const utils = require('./route-utils')

router.get('/', function(req, res) {
    BlueBird.props({
            genotype: enum_controller.by_code('MOUSE_GENOTYPE'),
            male_mice: mouse_controller.by_sex('male'),
            female_mice: mouse_controller.by_sex('female')
        })
        .then(({ genotype, male_mice, female_mice }) => {
            let gt = utils.select_json(genotype, 'mouse_genotype', 'Genotype')
            let mm = utils.select_json(male_mice, 'male_mouse')
            let fm = utils.select_json(female_mice, 'female_mouse')

            res.render('pages/breed/list', { genotype_data: gt, male_mouse_data: mm, female_mouse_data: fm })
        })


});

module.exports = router;
