
import { Router, Request, Response } from 'express';
const router: Router = Router();

const isFalsey = require('falsey');

import P from 'bluebird';
const BlueBird = P.Promise;

import { Cage_Controller } from '../controllers/cage_controller';
import { cage_utils } from './utils_cage_routes';

// const { cool_face, utils.select_json, utils.log_json, utils.reshape_for_select } = require('./utils_routes');
import { utils } from './utils_routes';

router.get('/', (req: Request, res: Response) => {
    BlueBird.props({
        cages: Cage_Controller.all_pretty(),
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

router.get('/create', (req: Request, res: Response) => {
    BlueBird.props({
        input: cage_utils.get_cage_inputs(),
    })
        .then(({ input }) => {
            let mice_select_tmp = input.mice
                .map((mouse) => ({ id: mouse.id, description: mouse.id_alias }));
            let mice_select = utils.select_json(mice_select_tmp, utils.reshape_for_select);
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

// update page
router.get('/:id_alias', (req: Request, res: Response) => {
    BlueBird.props({
        input: cage_utils.get_cage_inputs(),
        cage: Cage_Controller.by_id_alias(req.params.id_alias),
    })
        .then(({ input, cage }) => {
            const { mice } = input;
            const mice_select = utils.select_json(input.mice, utils.reshape_for_select);
            const cage_type = utils.select_json(input.cage_type);
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

router.delete('/:id', (req: Request, res: Response) => {
    const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;
    const rm_promises = rm_ids.split(',').map((id:any) => {
        Cage_Controller.delete(id);
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

router.put('/', (req: Request, res: Response) => {
    // move_note(req);
    // utils.log_json(req.body);
    const model = cage_utils.create_model(req.body);
    // let model = new cage_model(req.body)
    Cage_Controller.insert(model)
        .then((x) => {
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

router.post('/', (req: Request, res: Response) => {
    // move_note(req);
    // utils.log_json(req.body);
    const model = cage_utils.create_model(req.body);

    Cage_Controller.update(model)
        .then(() => {
            res.send({ success: true });
        })
        .catch((err) => {
            res.status(500).send({ success: false, err });
        });
});


module.exports = router;
