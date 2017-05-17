const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse'))
const cage_controller = require(path.join(__dirname, '..', 'controllers/cage'))
const utils = require('./route-utils')

router.get('/mouse', function(req, res) {
    BlueBird.props({
            status: enum_controller.getByEnumTypeCode('MOUSE_STATUS'),
            genotype: enum_controller.getByEnumTypeCode('MOUSE_GENOTYPE'),
            cages: cage_controller.getAll(),
            sex: enum_controller.getByEnumTypeCode('SEX')
        })
        .then(({status, genotype, cages, sex}) => {
            status = utils.selectJSON(status, 'status_id')
            genotype = utils.selectJSON(genotype, 'genotype_id')
            cages = cages.map((cage) => {
                return {
                    id: cage.id,
                    description: cage.name
                }
            })
            sex = utils.selectJSON(sex, 'sex_id')
            cages = utils.selectJSON(cages, 'cage_id')
            res.render('pages/mouse', {
                status,
                genotype,
                cages,
                sex
            })
        })


});

router.get('/mice', function(req, res) {
    mouse_controller.getAllPretty()
        .then((mouse_array) => {
            res.send({
                data: mouse_array
            })
        })
});

router.post('/mouse', function(req, res) {
    utils.logJSON(req.body)
    mouse_controller.insert(req.body)
    res.send({success:true})
});

module.exports = router;
