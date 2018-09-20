const express = require('express');

const router = express.Router();

// const Logger = require('bug-killer');
const BlueBird = require('bluebird');
const _ = require('underscore');
const isFalsey = require('falsey');

const enum_controller = require('../controllers/enum_controller');
const breed_controller = require('../controllers/breed_controller');
const mouse_controller = require('../controllers/mouse_controller');
const cage_controller = require('../controllers/cage_controller');
// const utils = require('./utils_routes');
const {
    select_json, log_json, getErrorGif, cool_face, today,
} = require('./utils_routes');
const { get_inputs, create_model, do_status_upsert } = require('./utils_mouse_routes');

const BATCH_SIZE = 10;
/*
// http://mherman.org/blog/2016/03/13/designing-a-restful-api-with-node-and-postgres/
router.get('/api/mice', db.getAllPuppies);
router.get('/api/mice/:id', db.getSinglePuppy);
router.post('/api/mice', db.createPuppy);
router.put('/api/mice/:id', db.updatePuppy);
router.delete('/api/mice/:id', db.removePuppy);
*/

router.get('/', (req, res) => {
    BlueBird.props({
        input: get_inputs(),
        mice: mouse_controller.all_pretty(),
    })
        .then(({ input, mice }) => {
            const status = select_json(input.status, 'status_id');
            res.render('pages/mouse/mouse_list', {
                cages: input.cages,
                mice,
                status,
                extra_js: ['mouse_list.bundle.js'],
                cool_face: cool_face(),
                model_name: 'mouse',
            });
        })
        .catch((error) => {
            getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl,
                });
            });
        });
});

router.get('/more_rows', (req, res) => {
    // req.body.offset;
    BlueBird.props({
        mice: mouse_controller.some_pretty(BATCH_SIZE, req.body.offset),
    })
        .then(({ mice }) => {
            res.send({
                mice,
            });
        })
        .catch((error) => {
            getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl,
                });
            });
        });
});

router.get('/create', (req, res) => {
    BlueBird.props({
        input: get_inputs(),
    })
        .then(({ input }) => {
            const status = select_json(input.status, 'status_id');
            const genotype = select_json(input.genotype, 'genotype_id');
            let cages = input.cages.map(cage => ({
                id: cage.id,
                description: cage.id_alias,
            }));
            const sex = select_json(input.sex, 'sex_id');
            cages = select_json(cages, 'cage_id');
            res.render('pages/mouse/mouse_create', {
                status,
                genotype,
                cages,
                sex,
                extra_js: ['mouse_create.bundle.js'],
                cool_face: cool_face(),
            });
        })
        .catch((error) => {
            getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl,
                });
            });
        });
});

router.get('/:id_alias', (req, res) => {
    let mouse;
    mouse_controller.by_id_alias(req.params.id_alias)
        .then((_mouse) => {
            mouse = _mouse;
            return get_inputs();
        })
        .then((input) => {
            const status = select_json(input.status, 'status_id');
            const genotype = select_json(input.genotype, 'genotype_id');
            let cages = input.cages.map(cage => ({
                id: cage.id,
                description: cage.id_alias,
            }));
            const sex = select_json(input.sex, 'sex_id');
            cages = select_json(cages, 'cage_id');
            log_json(mouse);

            // mouse_controller.pretty(mouse).then((x)=>{
            //     log_json(x)})

            res.render('pages/mouse/mouse_update', {
                status,
                genotype,
                cages,
                sex,
                mouse,
                extra_js: ['mouse_update.bundle.js'],
                cool_face: cool_face(),
            });
        })
        .catch((error) => {
            getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl,
                });
            });
        });
});

router.delete('/:id', (req, res) => {
    const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;

    const rm_promises = rm_ids.split(',').map((id) => {
        mouse_controller.delete(id);
    });

    return Promise.all(rm_promises)
        .then(() => {
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

// create action mice
router.put('/', (req, res) => {
    log_json(req.body);
    
    BlueBird.props({
        model: create_model(req.body),
        sex_id_map: enum_controller.by_type_map(mouse_controller.SEX),
    })
        .then(({ model, sex_id_map }) => {
            const slider_sex_ids = ['male', 'female', 'unknown'];
            const create_mouse_promises = slider_sex_ids
                .filter(sex_type => parseInt(model[sex_type], 10) > 0)
                .map((sex_type) => {
                    const tmp_model = model;
                    tmp_model.sex_id = sex_id_map[sex_type];
                    const create_mouse_count = _.range(parseInt(tmp_model[sex_type], 10));
                    return create_mouse_count.map(() => mouse_controller.insert(tmp_model));
                });
            return Promise.all(create_mouse_promises);
        })
        .then(() => res.send({ success: true }))
        .catch((err) => {
            log_json(err);
            res.status(500).send({
                success: false,
                err,
            });
        });
});

router.post('/cage_mice_together', (req, res) => {
    log_json(req.body);
    let cage_id_promise;

    if (isFalsey(req.body.cage_id[0])) {
        const cage = {};
        cage.id_alias = req.body.cage_id_alias;
        cage.setup_date = today();
        cage_id_promise = cage_controller.insert(cage)
            .then(c => c.id);
    } else {
        cage_id_promise = Promise.resolve(req.body.cage_id[0]);
    }

    cage_id_promise.then((cage_id) => {
        const update_promises = req.body.mouse_ids
            .map(id => mouse_controller.update({ id, cage_id }));

        Promise.all(update_promises)
            .then(() => res.send({ success: true }))
            .catch((err) => {
                log_json(err);
                res.status(500).send({
                    success: false,
                    err,
                });
            });
    });
});

router.post('/update_mice_status', (req, res) => {
    log_json(req.body);
    const status_id_promise = do_status_upsert({ status_description: req.body.status_description });

    status_id_promise.then((status_id) => {
        const update_promises = req.body.mouse_ids
            .map(id => mouse_controller.update({ id, status_id }));

        Promise.all(update_promises)
            .then(() => enum_controller.get(status_id))
            .then(status => res.send({
                success: true,
                status: status.description,
            }))
            .catch((err) => {
                log_json(err);
                res.status(500).send({
                    success: false,
                    err,
                });
            });
    })
        .catch((err) => {
            log_json(err);
            res.status(500).send({
                success: false,
                err,
            });
        });
});

router.post('/breed_mice_together', (req, res) => {
    log_json(req.body);
    const { mouse_group_by_sex } = req.body;
    const female_id_list = mouse_group_by_sex.female;
    const male_id_list = mouse_group_by_sex.male;
    const create_breed_promises = female_id_list.map(female_id => male_id_list.map((male_id) => {
        const new_breed = {
            pairing_date: Date(),
            male_id,
            female_id,
        };
        return breed_controller.insert(new_breed)
            .then((breed) => {
                const updated_breed = {
                    id_alias: `b-${breed.id}`,
                };
                const update_breed = breed.update(updated_breed);
                const update_male = mouse_controller.get(male_id)
                    .then(mouse => mouse.addBreed(breed));
                const update_female = mouse_controller.get(female_id)
                    .then(mouse => mouse.addBreed(breed));

                return Promise.all([update_breed, update_male, update_female]);
            });
    }));
    return Promise.all(create_breed_promises)
        .then(() => res.send({ success: true }))
        .catch((err) => {
            log_json(err);
            res.status(500).send({
                success: false,
                err,
            });
        });
});

// update mouse action
router.post('/', (req, res) => {
    log_json(req.body);

    mouse_controller.update(req.body).then(() => {
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

module.exports = router;
