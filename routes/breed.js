const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse'))
const utils = require('./route-utils')

router.get('/breed', function(req, res) {
    BlueBird.all([enum_controller.getByEnumTypeCode('MOUSE_GENOTYPE'),
            mouse_controller.getMaleMiceForSelect(),
            mouse_controller.getFemaleMiceForSelect()
        ])
        .spread((g, m, f) => {
        	let gt = utils.selectJSON(g, 'mouse_genotype', 'Genotype')
        	utils.logJSON(gt)
        	utils.logJSON(m)
        	
        	let mm = utils.selectJSON(m, 'male_mouse')
        	

			let fm = utils.selectJSON(f, 'female_mouse')
        	
            res.render('pages/breed', {genotype_data: gt, male_mouse_data: mm, female_mouse_data: fm})
        })


});

module.exports = router;
