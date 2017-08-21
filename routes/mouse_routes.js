const express = require('express');
const router = express.Router();
const path = require('path');
const Logger = require('bug-killer');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum_controller'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse_controller'))
const cage_controller = require(path.join(__dirname, '..', 'controllers/cage_controller'))
const utils = require('./utils_routes')


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
            input: _get_mouse_inputs(),
            mice: mouse_controller.all_pretty()
        })
        .then(({input, mice}) => {
            const status = utils.select_json(input.status, 'status_id')
            const genotype = utils.select_json(input.genotype, 'genotype_id')
            let cages = input.cages.map((cage) => {
                return {
                    id: cage.id,
                    description: cage.name
                }
            })
            const sex = utils.select_json(input.sex, 'sex_id')
            cages = utils.select_json(cages, 'cage_id')
            res.render('pages/mouse/mouse_list', {
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

router.get('/create', function(req, res) {
    BlueBird.props({
            input: _get_mouse_inputs(),
        })
        .then(({input}) => {
            const status = utils.select_json(input.status, 'status_id')
            const genotype = utils.select_json(input.genotype, 'genotype_id')
            let cages = input.cages.map((cage) => {
                return {
                    id: cage.id,
                    description: cage.name
                }
            })
            const sex = utils.select_json(input.sex, 'sex_id')
            cages = utils.select_json(cages, 'cage_id')
            res.render('pages/mouse/mouse_create', {
                status,
                genotype,
                cages,
                sex,
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
function _get_mouse_inputs(){
    return BlueBird.props({
            status: enum_controller.by_type('MOUSE_STATUS'),
            genotype: enum_controller.by_type('MOUSE_GENOTYPE'),
            cages: cage_controller.all(),
            sex: enum_controller.by_type('SEX'),
        })
}

router.get('/:id_alias', function(req, res) {
    let mouse
        mouse_controller.by_id_alias(req.params.id_alias)
        .then(_mouse => {
            mouse = _mouse
            return _get_mouse_inputs() 
        })
        .then(input => {
            const status = utils.select_json(input.status, 'status_id')
            const genotype = utils.select_json(input.genotype, 'genotype_id')
            let cages = input.cages.map((cage) => {
                return {
                    id: cage.id,
                    description: cage.name
                }
            })
            const sex = utils.select_json(input.sex, 'sex_id')
            cages = utils.select_json(cages, 'cage_id')
            utils.log_json(mouse)

            // mouse_controller.pretty(mouse).then((x)=>{
            //     utils.log_json(x)})

            res.render('pages/mouse/mouse_update', {
                status,
                genotype,
                cages,
                sex,
                mouse,
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

    // mouse_controller.by_id_alias(req.params.id).then((x) => {
    //         return mouse_controller.pretty(x)
    //     })
    //     .then((y) => {
    //         res.render('pages/mouse/mouse_update', y)
    //         // res.send(y)

    //     })
    //
});

router.delete('/:id', function(req, res) {
    if (req.query.id_alias) {
            mouse_controller.delete_by_id_alias(req.params.id).then((x) => {
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
    } 
    else {
        mouse_controller.delete(req.params.id).then((x) => {
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
    }
    
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
    req.body.note = {}
    req.body.note.text = req.body.notes
    delete req.body.notes
    utils.log_json(req.body)
    
    mouse_controller.insert(req.body)
        .then((x) => {
            res.send({
                success: true
            })
        })
        .catch((err) => {
            utils.log_json(err)
            res.status(500).send({
                success: false,
                err
            })
        })
});

router.post('/', function(req, res) {
    req.body.note = {}
    req.body.note.text = req.body.notes
    delete req.body.notes
    utils.log_json(req.body)

    mouse_controller.update(req.body).then((x) => {
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
