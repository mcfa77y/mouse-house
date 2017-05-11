const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse'))

function logJSON(json) {
    console.log(JSON.stringify(json, null, 4))
}
router.get('/breed', function(req, res) {
    BlueBird.all([enum_controller.getByEnumTypeCode('MOUSE_GENOTYPE'),
            mouse_controller.getMaleMiceForSelect(),
            mouse_controller.getFemaleMiceForSelect()
        ])
        .spread((g, m, f) => {
        	let gt = {}
        	gt.items = g
        	gt.id="mouse_genotype"
        	gt.description="Genotype"
        	logJSON(gt)
        	logJSON(m)
        	
        	let mm = {}
        	mm.items = m
        	mm.id="male_mouse"
        	mm.description="male mouse"

			let fm = {}
        	fm.items = f
        	fm.id="female_mouse"
        	fm.description="female mouse"
            res.render('pages/breed', {genome_data: gt, male_mouse_data: mm, female_mouse_data: fm})
        })


});

module.exports = router;
