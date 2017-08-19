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
            cage_type: enum_controller.by_type('CAGE_TYPE'),
            cages: cage_controller.all_pretty()
        })
        .then(({ mice, cage_type, cages }) => {
            mice = mice.map((mouse) => {
                return { id: mouse.id, description: mouse.id_alias }
            })
            mice = utils.select_json(mice)
            cage_type = utils.select_json(cage_type)
            utils.log_json(cages)
            res.render('pages/cage/cage_list', {
                mice,
                cage_type,
                cages,
                extra_js: ['cs-cage'],
                cool_face: utils.cool_face()
            })
        })
});

router.get('/create', function(req, res) {
    BlueBird.props({
            mice: mouse_controller.all(),
            cage_type: enum_controller.by_type('CAGE_TYPE'),
            cages: cage_controller.all_pretty()
        })
        .then(({ mice, cage_type, cages }) => {
            mice = mice.map((mouse) => {
                return { id: mouse.id, description: mouse.id_alias }
            })
            mice = utils.select_json(mice)
            cage_type = utils.select_json(cage_type)
            utils.log_json(cages)
            res.render('pages/cage/cage_create', {
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
            cage_type: enum_controller.by_type('CAGE_TYPE'),
            cage: cage_controller.by_id_alias(req.params.id)
        })
        .then(({ mice, cage_type, cage }) => {
            mice = mice.map((mouse) => {
                return { id: mouse.id, description: mouse.id_alias }
            })
            mice = utils.select_json(mice, 'mouse_ids', 'mice')
            cage_type = utils.select_json(cage_type, 'cage_type')
            utils.log_json(cage)
            res.render('pages/cage/cage_update', {
                mice,
                cage_type,
                cage,
                extra_js: ['cs-cage'],
                cool_face: utils.cool_face()
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({ success: false, err })
        })
});

router.delete('/:id', function(req, res) {
    cage_controller.delete(req.params.id).then((x) => {
            res.send({ success: true })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({ success: false, err })
        })
});

router.put('/', function(req, res) {
    const note = req.body.note
    req.body.note = {}
    req.body.note.text = note
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
    const note = req.body.note
    req.body.note = {}
    req.body.note.text = note
    utils.log_json(req.body)
    cage_controller.update(req.body).then((x) => {
            res.send({ success: true })
        })
        .catch((err) => {
            res.status(500).send({ success: false, err })
        })

});



module.exports = router;
