const express = require('express');
const router = express.Router();
const path = require('path');
const Logger = require('bug-killer');
const BlueBird = require('bluebird')
const _ = require('underscore')
const isFalsey = require('falsey');

const enum_controller = require(path.join(__dirname, '..', 'controllers/enum_controller'))
const breed_controller = require(path.join(__dirname, '..', 'controllers/breed_controller'))
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
        .then(({ input, mice }) => {
            res.render('pages/mouse/mouse_list', {
                cages: input.cages,
                mice,
                extra_js: ['cs-mouse-list'],
                cool_face: utils.cool_face()
            })
        })
        .catch((error) => {
            utils.getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl
                })
            })
        })
});

router.get('/create', function(req, res) {
    BlueBird.props({
            input: _get_mouse_inputs(),
        })
        .then(({ input }) => {
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
                extra_js: ['cs-mouse-create'],
                cool_face: utils.cool_face()
            })
        })
        .catch((error) => {
            utils.getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl
                })
            })
        })
});

function _get_mouse_inputs() {
    return BlueBird.props({
        status: enum_controller.by_type('MOUSE_STATUS'),
        genotype: enum_controller.by_type('MOUSE_GENOTYPE'),
        cages: cage_controller.all_pretty(),
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
                extra_js: ['cs-mouse-update'],
                cool_face: utils.cool_face()
            })
        })
        .catch((error) => {
            utils.getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl
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
    const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias

    const rm_promises = rm_ids.split(',').map(id => {
        mouse_controller.delete(id)
    })

    return Promise.all(rm_promises)
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

// router.get('/', function(req, res) {
//     mouse_controller.all_pretty()
//         .then((mouse_array) => {
//             res.send({
//                 data: mouse_array
//             })
//         })
// });

router.put('/', function(req, res) {
    utils.move_note(req)
    // if not null and doesn't parse to a number
    const is_new_alias_id = (id) => !isFalsey(id) && isFalsey(parseInt(id))
    if (is_new_alias_id(req.body.cage_id)) {
        req.body.cage = {}
        req.body.cage.id_alias = req.body.cage_id
        req.body.cage.setup_date = utils.today()
        delete req.body.cage_id
    }
    if (is_new_alias_id(req.body.status_id)) {
        req.body.status = {}
        req.body.status.description = req.body.status_id
        req.body.status.type = 'MOUSE_STATUS'
        delete req.body.status_id
    }
    if (is_new_alias_id(req.body.genotype_id)) {
        req.body.genotype = {}
        req.body.genotype.description = req.body.genotype_id
        req.body.genotype.type = 'MOUSE_GENOTYPE'
        delete req.body.genotype_id
    }

    utils.log_json(req.body)
    const slider_ids = ['male', 'female', 'unknown']
    enum_controller.by_type('SEX')
        .then(sex_types => {
            let sex_id_map = {}
            sex_types.forEach(sex_type => {
                sex_id_map[sex_type.description] = sex_type.id
            })
            return sex_id_map
        })
        .then(sex_id_map => {
            const create_mouse_promises = slider_ids
                .filter(id => parseInt(req.body[id]) > 0)
                .map(id => {
                    req.body.sex_id = sex_id_map[id]
                    const create_mouse_count = _.range(parseInt(req.body[id]))
                    return create_mouse_count.map(x => mouse_controller.insert(req.body))
                })
            return Promise.all(create_mouse_promises)
        })
        .then(() => res.send({ success: true }))
        .catch((err) => {
            utils.log_json(err)
            res.status(500).send({
                success: false,
                err
            })
        })
});

router.post('/cage_mice_together', function(req, res) {
    utils.log_json(req.body)
    const cage_id = req.body.cage_id[0]
    const update_promises = req.body.mouse_ids
        .map(id => mouse_controller.update({ id, cage_id }))

    Promise.all(update_promises)
        .then(() => res.send({ success: true }))
        .catch((err) => {
            utils.log_json(err)
            res.status(500).send({
                success: false,
                err
            })
        })
});


router.post('/breed_mice_together', function(req, res) {
    utils.log_json(req.body)
    const mouse_ids = req.body.mouse_ids
    return enum_controller.by_type('SEX').then(sex_enums => {
            let sex_map = {}
            sex_enums.forEach(sex => sex_map[sex.id] = sex.description)
            return sex_map
        })
        .then((sex_map) => {
            return mouse_controller.get_where({
                    id: {
                        $in: mouse_ids
                    }
                })
                .then(items => {
                    return _.groupBy(items, (item) => {
                        return sex_map[item.sex_id]
                    })
                })

        })
        .then((mice_group_by_sex) => {
            const male_mouse = mice_group_by_sex.male[0]

            const create_breed_promises = mice_group_by_sex.female.map(female_mouse => {


                return breed_controller
                    .insert({})
                    .then(breed => {
                        breed.update({ id_alias: breed.id, pairing_date: Date() })
                        return breed.addMice([male_mouse, female_mouse])
                    })
            })

            return Promise.all(create_breed_promises)
                .then(() => res.send({ success: true }))
                .catch((err) => {
                    utils.log_json(err)
                    res.status(500).send({
                        success: false,
                        err
                    })
                })

        })
});

router.post('/', function(req, res) {
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