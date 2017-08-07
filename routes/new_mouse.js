const express = require('express');
const router = express.Router();
const path = require('path');
const Logger = require('bug-killer');
const BlueBird = require('bluebird')
const new_enum_controller = require(path.join(__dirname, '..', 'controllers/new_enum'))
const new_mouse_controller = require(path.join(__dirname, '..', 'controllers/new_mouse'))
const new_cage_controller = require(path.join(__dirname, '..', 'controllers/new_cage'))
const mouse_model = require(path.join(__dirname, '..', 'database/models/mouse'))
const utils = require('./route-utils')


/*
// http://mherman.org/blog/2016/03/13/designing-a-restful-api-with-node-and-postgres/
router.get('/api/mice', db.getAllPuppies);
router.get('/api/mice/:id', db.getSinglePuppy);
router.post('/api/mice', db.createPuppy);
router.put('/api/mice/:id', db.updatePuppy);
router.delete('/api/mice/:id', db.removePuppy);
*/

router.get('/', function(req, res) {
    BlueBird.props({
            status: new_enum_controller.by_code('MOUSE_STATUS'),
            genotype: new_enum_controller.by_code('MOUSE_GENOTYPE'),
            cages: new_cage_controller.all(),
            sex: new_enum_controller.by_code('SEX'),
            mice: new_mouse_controller.all_pretty()
        })
        .then(({status, genotype, cages, sex, mice}) => {
            status = utils.select_json(status, 'status_id')
            genotype = utils.select_json(genotype, 'genotype_id')
            cages = cages.map((cage) => {
                return {
                    id: cage.id,
                    description: cage.name
                }
            })
            sex = utils.select_json(sex, 'sex_id')
            cages = utils.select_json(cages, 'cage_id')
            res.render('pages/mouse/list', {
                status,
                genotype,
                cages,
                sex,
                mice,
                extra_js: ['cs-mouse'],
                cool_face: utils.cool_face()
            })
        })
        .catch((error) => {
            utils.getErrorGif().then((errorImageUrl) =>{
                res.render('error', {
                    error, errorImageUrl
                })
            })
        })
});

router.get('/:id', function(req, res) {
    BlueBird.props({
            status: new_enum_controller.by_code('MOUSE_STATUS'),
            genotype: new_enum_controller.by_code('MOUSE_GENOTYPE'),
            cages: new_cage_controller.all(),
            sex: new_enum_controller.by_code('SEX'),
            mouse: new_mouse_controller.by_id_alias(req.params.id)
        })
        .then(({ status, genotype, cages, sex, mouse }) => {
            status = utils.select_json(status, 'status_id')
            genotype = utils.select_json(genotype, 'genotype_id')
            cages = cages.map((cage) => {
                return {
                    id: cage.id,
                    description: cage.name
                }
            })
            sex = utils.select_json(sex, 'sex_id')
            cages = utils.select_json(cages, 'cage_id')
            mouse = mouse[0]
            utils.log_json(mouse)

            // mouse_controller.pretty(mouse).then((x)=>{
            //     utils.log_json(x)})

            res.render('pages/mouse/update', {
                status,
                genotype,
                cages,
                sex,
                mouse,
                extra_js: ['cs-mouse'],
                cool_face: utils.cool_face()
            })
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err
            })
        })

    // mouse_controller.by_id_alias(req.params.id).then((x) => {
    //         return mouse_controller.pretty(x)
    //     })
    //     .then((y) => {
    //         res.render('pages/mouse/update', y)
    //         // res.send(y)

    //     })
    //
});

router.delete('/:id', function(req, res) {
    new_mouse_controller.delete_by_id_alias(req.params.id).then((x) => {
            res.send({
                success: true
            })
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err
            })
        })
});

// router.get('/', function(req, res) {
//     mouse_controller.all_pretty()
//         .then((mouse_array) => {
//             res.send({
//                 data: mouse_array
//             })
//         })
// });

router.put('/', function(req, res) {
    utils.log_json(req.body)
    new_mouse_controller.insert(req.body)
        .then((x) => {
            res.send({
                success: true
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
    utils.log_json(req.body)

    new_mouse_controller.update(req.body).then((x) => {
            res.send({
                success: true
            })
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err
            })
        })
});

module.exports = router;
