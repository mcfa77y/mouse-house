import { Router, Request, Response } from 'express';
const router: Router = Router();

// const express = require('express');

// const router = express.Router();

// const Logger = require('bug-killer');

import P from 'bluebird';
const BlueBird = P.Promise;

const _ = require('underscore');
const isFalsey = require('falsey');

import { Enum_Controller } from '../controllers_src/enum_controller';
import { Breed_Controller } from '../controllers_src/breed_controller';
import { Mouse_Controller, Pretty_Mouse } from '../controllers_src/mouse_controller';
import { Cage_Controller } from '../controllers_src/cage_controller';
// const utils = require('./utils_routes');
const {
    select_json, log_json, getErrorGif, cool_face, today,
} = require('./utils_routes');
import { utils } from './utils_mouse_routes';
import { Cage_Instance } from '../database/models/Cage';

const BATCH_SIZE = 10;
/*
// http://mherman.org/blog/2016/03/13/designing-a-restful-api-with-node-and-postgres/
router.get('/api/mice', db.getAllPuppies);
router.get('/api/mice/:id', db.getSinglePuppy);
router.post('/api/mice', db.createPuppy);
router.put('/api/mice/:id', db.updatePuppy);
router.delete('/api/mice/:id', db.removePuppy);
*/

router.get('/', (req: Request, res: Response) => {
    BlueBird.props({
        input: utils.get_inputs(),
        mice: Mouse_Controller.all_pretty(),
    })
        .then(({ input, mice }) => {
            const status = select_json(input.status);
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

router.get('/more_rows', (req: Request, res: Response) => {
    // req.body.offset;
    BlueBird.props({
        mice: Mouse_Controller.some_pretty(BATCH_SIZE, req.body.offset),
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

router.get('/create', (req: Request, res: Response) => {
    BlueBird.props({
        input: utils.get_inputs(),
    })
        .then(({ input }) => {
            const status = select_json(input.status);
            const genotype = select_json(input.genotype);
            let cages = input.cages.map(cage => ({
                id: cage.id,
                description: cage.id_alias,
            }));
            const sex = select_json(input.sex);
            cages = select_json(cages);
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

router.get('/:id_alias', (req: Request, res: Response) => {
    let mouse: Pretty_Mouse;
    Mouse_Controller.by_id_alias(req.params.id_alias)
        .then((_mouse) => {
            mouse = _mouse;
            return utils.get_inputs();
        })
        .then((input) => {
            const status = select_json(input.status);
            const genotype = select_json(input.genotype);
            let cages = input.cages.map(cage => ({
                id: cage.id,
                description: cage.id_alias,
            }));
            const sex = select_json(input.sex);
            cages = select_json(cages);
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

router.delete('/:id', (req: Request, res: Response) => {
    const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;

    const rm_promises = rm_ids.split(',').map((id: number) => {
        Mouse_Controller.Model.destroy({ where: { id } });
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
router.put('/', (req: Request, res: Response) => {
    log_json(req.body);

    BlueBird.props({
        model: utils.create_model(req.body),
        sex_id_map: Enum_Controller.by_type_map(Mouse_Controller.SEX),
    })
        .then(({ model, sex_id_map }) => {
            const slider_sex_ids = ['male', 'female', 'unknown'];
            const create_mouse_promises = slider_sex_ids
                .filter(sex_type => parseInt(model[sex_type], 10) > 0)
                .map((sex_type) => {
                    const tmp_model = model;
                    tmp_model.sex_id = sex_id_map[sex_type];
                    const create_mouse_count = _.range(parseInt(tmp_model[sex_type], 10));
                    return create_mouse_count.map(() => Mouse_Controller.insert(tmp_model));
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

router.post('/cage_mice_together', (req: Request, res: Response) => {
    log_json(req.body);
    let cage_id_promise;

    if (isFalsey(req.body.cage_id[0])) {
        const cage: any = {};
        cage.id_alias = req.body.cage_id_alias;
        cage.setup_date = today();
        cage_id_promise = Cage_Controller.insert(cage)
            .then((c: Cage_Instance) => c.id);
    } else {
        cage_id_promise = Promise.resolve(req.body.cage_id[0]);
    }

    cage_id_promise.then((cage_id) => {
        const update_promises = req.body.mouse_ids
            .map((id: number) => Mouse_Controller.update({ id, cage_id }));

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

router.post('/update_mice_status', (req: Request, res: Response) => {
    log_json(req.body);
    const status_id_promise = utils.do_status_upsert({ status_description: req.body.status_description });

    status_id_promise.then((status_id) => {
        const update_promises = req.body.mouse_ids
            .map((id: number) => Mouse_Controller.update({ id, status_id }));

        Promise.all(update_promises)
            .then(() => Enum_Controller.Model.findById(status_id))
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

router.post('/breed_mice_together', (req: Request, res: Response) => {
    log_json(req.body);
    const { mouse_group_by_sex } = req.body;
    const female_id_list = mouse_group_by_sex.female;
    const male_id_list = mouse_group_by_sex.male;
    const create_breed_promises = female_id_list.map((female_id: number) => male_id_list.map((male_id: number) => {
        const new_breed = {
            pairing_date: Date(),
            male_id,
            female_id,
        };
        return Breed_Controller.insert(new_breed)
            .then((breed) => {
                const updated_breed = {
                    id_alias: `b-${breed.id}`,
                };
                const update_breed = breed.update(updated_breed);
                const update_male = Mouse_Controller.Model.findById(male_id)
                    .then(mouse => mouse.addBreed(breed));
                const update_female = Mouse_Controller.Model.findById(female_id)
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
router.post('/', (req: Request, res: Response) => {
    log_json(req.body);

    Mouse_Controller.update(req.body).then(() => {
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
