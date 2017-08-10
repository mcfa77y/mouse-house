const express = require('express');
const router = express.Router();
const path = require('path');
const BlueBird = require('bluebird')

const enum_controller = require(path.join(__dirname, '..', 'controllers/enum_controller'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse_controller'))
const cage_controller = require(path.join(__dirname, '..', 'controllers/cage_controller'))

const utils = require('./utils_routes')

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
        .catch((err) => {
            res.status(500).send({ success: false, err })
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

router.put('/', function(req, res) {
    utils.log_json(req.body)
    //let model = new cage_model(req.body)
    cage_controller.insert(req.body).then((x) => {
            res.send({
                success: true,
                x:x
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
    let model = new cage_model(req.body)
    cage_controller.create
    cage_controller.insert(model).then((x) => {
            res.send({ success: true })
        })
        .catch((err) => {
            res.status(500).send({ success: false, err })
        })

});



module.exports = router;
