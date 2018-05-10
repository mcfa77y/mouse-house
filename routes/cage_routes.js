const express = require('express');
const isFalsey = require('falsey');

const router = express.Router();
const BlueBird = require('bluebird');

const enum_controller = require('../controllers/enum_controller');
const mouse_controller = require('../controllers/mouse_controller');
const cage_controller = require('../controllers/cage_controller');

const utils = require('./utils_routes');

router.get('/', (req, res) => {
    BlueBird.props({
        cages: cage_controller.all_pretty(),
    })
        .then(({ cages }) => {
            utils.log_json(cages);
            res.render('pages/cage/cage_list', {
                cages,
                extra_js: ['cage_list.bundle.js'],
                cool_face: utils.cool_face(),
            });
        });
});

router.get('/create', (req, res) => {
    BlueBird.props({
        input: _get_cage_inputs(),
    })
        .then(({ input }) => {
            let mice_select = input.mice.map(mouse => ({ id: mouse.id, description: mouse.id_alias }));
            mice_select = utils.select_json(mice_select);
            const cage_type = utils.select_json(input.cage_type);
            const { mice } = input;
            const verb = 'Add';
            res.render('pages/cage/cage_update', {
                mice,
                mice_select,
                cage_type,
                extra_js: ['cage_create.bundle.js'],
                cool_face: utils.cool_face(),
                verb,
            });
        });
});

function _get_cage_inputs() {
    return BlueBird.props({
        mice: mouse_controller.all_pretty(),
        cage_type: enum_controller.by_type('CAGE_TYPE'),
    });
}

// update page
router.get('/:id_alias', (req, res) => {
    BlueBird.props({
        input: _get_cage_inputs(),
        cage: cage_controller.by_id_alias(req.params.id_alias),
    })
        .then(({ input, cage }) => {
            const mice = input.mice;
            const mice_select = utils
                .select_json(input.mice
                    .map(mouse => ({ id: mouse.id, description: mouse.id_alias })), 'mouse_ids', 'mice');
            const cage_type = utils.select_json(input.cage_type, 'cage_type');
            const verb = 'Update';
            utils.log_json(cage);
            
            res.render('pages/cage/cage_update', {
                mice,
                mice_select,
                cage_type,
                cage,
                extra_js: ['cage_update.bundle.js'],
                cool_face: utils.cool_face(),
                verb,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ success: false, err });
        });
});

router.delete('/:id', (req, res) => {
    const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;
    const rm_promises = rm_ids.split(',').map((id) => {
        cage_controller.delete(id);
    });

    return Promise.all(rm_promises)
        .then((x) => {
            res.send({
                success: true,
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err,
            });
        });
});

router.put('/', (req, res) => {
    utils.move_note(req);
    utils.log_json(req.body);
    // let model = new cage_model(req.body)
    cage_controller.insert(req.body).then((x) => {
        res.send({
            success: true,
            x,
        });
    })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err,
            });
        });
});

router.post('/', (req, res) => {
    utils.move_note(req);
    utils.log_json(req.body);
    cage_controller.update(req.body).then((x) => {
        res.send({ success: true });
    })
        .catch((err) => {
            res.status(500).send({ success: false, err });
        });
});


module.exports = router;
