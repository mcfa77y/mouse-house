// const express = require('express');
// const router = express.Router();

import { Router, Request, Response } from 'express';
const router: Router = Router();

import P from 'bluebird';
const BlueBird = P.Promise;
import {Breed_Controller} from '../controllers/breed_controller'

const isFalsey = require('falsey');

// const Breed_Controller = require('../controllers_src/breed_controller');
import { utils } from './utils_routes';
const { get_breed_inputs, create_model } = require('./utils_breed_routes');

// list
router.get('/', (req: Request, res: Response) => {
    BlueBird.props({
        breeds: Breed_Controller.all_pretty(),
    })
        .then(({ breeds }) => {
            utils.log_json(breeds);
            const non_empty_breeds = breeds.filter(breed => !isFalsey(breed));
            res.render('pages/breed/breed_list', {
                breeds: non_empty_breeds,
                extra_js: ['breed_list.bundle.js'],
            });
        })
        .catch((error) => {
            utils.getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl,
                });
            });
        });
});
router.get('/create', (req: Request, res: Response) => {
    BlueBird.props({
        input: get_breed_inputs(),
    })
        .then(({
            input: {
                genotype, male_mice, female_mice, mice,
            },
        }) => {
            const gt = utils.select_json(genotype);
            const mm = utils.select_json(male_mice, utils.reshape_for_select);
            const fm = utils.select_json(female_mice, utils.reshape_for_select);

            res.render('pages/breed/breed_create', {
                genotype: gt,
                male_mice: mm,
                mice,
                female_mice: fm,
                extra_js: ['breed_create.bundle.js'],
            });
        })
        .catch((error) => {
            utils.getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl,
                });
            });
        });
});

router.get('/:id_alias', (req: Request, res: Response) => {
    BlueBird.props({
        input: get_breed_inputs(),
        breed: Breed_Controller.by_id_alias(req.params.id_alias),
    })
        .then(({ input, breed }) => {
            utils.log_json(breed);
            const genotype = utils.select_json(input.genotype);
            const male_mice = utils.select_json(input.male_mice, utils.reshape_for_select);
            const female_mice = utils.select_json(input.female_mice, utils.reshape_for_select);
            utils.log_json(breed);

            res.render('pages/breed/breed_update', {
                genotype,
                male_mice,
                female_mice,
                breed,
                extra_js: ['breed_update.bundle.js'],
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ success: false, err });
        });
});

router.delete('/:id', (req: Request, res: Response) => {
    const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;

    const rm_promises = rm_ids.split(',').map((id: number) => Breed_Controller.delete(id));

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

router.put('/', (req: Request, res: Response) => {
    const model = create_model(req.body);
    Breed_Controller.insert(model)
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

// update
router.post('/', (req: Request, res: Response) => {
    const model = create_model(req.body);
    Breed_Controller.update(model)
        .then(() => {
            res.send({ success: true });
        })
        .catch((err) => {
            res.status(500).send({ success: false, err });
        });
});

module.exports = router;
