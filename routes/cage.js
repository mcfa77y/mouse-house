const express = require('express');
const router = express.Router();
const path = require('path');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse'))
const cage_controller = require(path.join(__dirname, '..', 'controllers/cage'))
const cage_model = require(path.join(__dirname, '..', 'models/cage'))
const utils = require('./route-utils')

router.get('/', function(req, res) {
    BlueBird.props({
            mice: mouse_controller.all(),
            cage_type: enum_controller.by_code('CAGE_TYPE'),
            cages: cage_controller.all_pretty()
        })
        .then(({ mice, cage_type, cages }) => {
            mice = mice.map((mouse) => {
                return { id: mouse.id, description: mouse.id }
            })
            mice = utils.select_json(mice, 'mouse_ids', 'mice')
            cage_type = utils.select_json(cage_type, 'cage_type')
            utils.log_json(cages)
            res.render('pages/cage/list', {
                mice,
                cage_type,
                cages,
                extra_js: ['cs-cage'],
                cool_face: utils.cool_face()
            })
        })
});

router.get('/:id', function(req, res) {
    BlueBird.props({
            mice: mouse_controller.all(),
            cage_type: enum_controller.by_code('CAGE_TYPE'),
            cage: cage_controller.by_id_alias(req.params.id)
        })
        .then(({ mice, cage_type, cage }) => {
            mice = mice.map((mouse) => {
                return { id: mouse.id, description: mouse.id }
            })
            mice = utils.select_json(mice, 'mouse_ids', 'mice')
            cage_type = utils.select_json(cage_type, 'cage_type')
            utils.log_json(cage)
            res.render('pages/cage/update', {
                mice,
                cage_type,
                cage,
                extra_js: ['cs-cage'],
                cool_face: utils.cool_face()
            })
        })
});

router.delete('/:id', function(req, res) {
    cage_controller.delete(req.params.id).then((x) => {
            res.send({ success: true })
        })
        .catch((err) => {
            res.status(500).send({ success: false, err })
        })
});

router.post('/', function(req, res) {
    let model = new cage_model(req.body)
    cage_controller.insert(model).then((x) => {
            res.send({ success: true })
        })
        .catch((err) => {
            res.status(500).send({ success: false, err })
        })

});



module.exports = router;
