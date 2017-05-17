const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse'))
const cage_controller = require(path.join(__dirname, '..', 'controllers/cage'))
const util = require('./route-utils')

router.get('/cage', function(req, res) {
    BlueBird.all([
            mouse_controller.all(),
            enum_controller.getByEnumTypeCode('MOUSE_STATUS'),
            enum_controller.getByEnumTypeCode('MOUSE_GENOTYPE'),

        ])
        .spread((m, s, g ) => {
            util.logJSON(m)
            util.logJSON(s)
            s = util.selectJSON(s, 'status')
            g = util.selectJSON(g, 'genotype')
            res.render('pages/cage', {
                mice_data: m,
                status: s,
                genotype: g
            })
        })


});

module.exports = router;
