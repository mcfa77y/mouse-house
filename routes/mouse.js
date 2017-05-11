const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse'))
const cage_controller = require(path.join(__dirname, '..', 'controllers/cage'))
const utils = require('./route-utils')

router.get('/mouse', function(req, res) {
    BlueBird.all([
            mouse_controller.getAll(),
            enum_controller.getByEnumTypeCode('MOUSE_STATUS'),
            enum_controller.getByEnumTypeCode('MOUSE_GENOTYPE'),
            cage_controller.getAll()

        ])
        .spread((m, s, g, c ) => {
            utils.logJSON(m)
            utils.logJSON(s)
            s = utils.selectJSON(s, 'status')
            g = utils.selectJSON(g, 'genotype')
            c = c.map((c)=>{return {id: c.id, description: c.name}})
            c = utils.selectJSON(c, 'cage')
            res.render('pages/mouse', {
                mice_data: m,
                status: s,
                genotype: g,
                cage: c
            })
        })


});

module.exports = router;
