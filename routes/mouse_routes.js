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
                extra_js: ['mouse_list.bundle.js'],
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
                extra_js: ['mouse_create.bundle.js'],
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
                extra_js: ['mouse_update.bundle.js'],
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
        .then(() => {
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

function do_enums(model){
    const is_new_alias_id = (id) => !isFalsey(id) && isFalsey(parseInt(id))
    if (is_new_alias_id(model.cage_id)) {
        const cage = {}
        cage.id_alias = model.cage_id
        cage.setup_date = utils.today()
        foo_promises.push(cage_controller.insert(cage)
            .then(c => model.cage_id = c.id))
    }
    if (is_new_alias_id(model.status_id)) {
        const status = {}
        status.description = model.status_id
        status.type = 'MOUSE_STATUS'
        foo_promises.push(enum_controller.insert(status)
            .then(enoom => model.status_id = enoom.id))
    }
    if (is_new_alias_id(model.genotype_id)) {
        const genotype = {}
        genotype.description = model.genotype_id
        genotype.type = 'MOUSE_GENOTYPE'
        foo_promises.push(enum_controller.insert(genotype)
            .then(enoom => model.genotype_id = enoom.id))
    }
}

router.put('/', function(req, res) {
    utils.move_note(req)
    let foo_promises = []
    // if not null and doesn't parse to a number
    

    utils.log_json(req.body)
    const slider_ids = ['male', 'female', 'unknown']
    Promise.all(foo_promises)
        .then(() => enum_controller.by_type_map('SEX')
        )
        .then(sex_id_map => {
            const create_mouse_promises = slider_ids
                .filter(id => parseInt(req.body[id]) > 0)
                .map(id => {
                    req.body.sex_id = sex_id_map[id]
                    const create_mouse_count = _.range(parseInt(req.body[id]))
                    return create_mouse_count.map(() => mouse_controller.insert(req.body))
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
    let cage_id_promise;
    let foo;
    if(isFalsey(req.body.cage_id[0])){
        const cage = {}
        cage.name = req.body.cage_name
        cage.setup_date = utils.today()
        cage_id_promise = cage_controller.insert(cage)
            .then(c => c.id)
    } else {
        cage_id_promise = Promise.resolve(req.body.cage_id[0])
    }
   
    cage_id_promise.then(cage_id =>{
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

    mouse_controller.update(req.body).then(() => {
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