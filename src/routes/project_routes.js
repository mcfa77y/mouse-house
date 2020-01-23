const express = require('express');
const BlueBird = require('bluebird');
const fs = require('fs');
const { falsy: isFalsey } = require('is_js');

const { select_json, log_json, getErrorGif } = require('./utils_routes');
const project_controller = require('../controllers/project_controller');
const experiment_controller = require('../controllers/experiment_controller');

const router = express.Router();
BlueBird.promisifyAll(fs);

router.get('/', async (req, res) => {
    const projects = await project_controller.all_pretty();
    res.render('pages/project/project_list', {
        extra_js: ['project_list.bundle.js'],
        projects,
    });
});

// create page
router.get('/create', async (req, res) => {
    console.log('foobar');
    
    const experiments = await experiment_controller.all_pretty();
    const experiments_select = select_json(experiments
        .map(model => ({ id: model.id, description: model.name })));
    console.log(`experiments_select: ${JSON.stringify(experiments_select, null, 2)}`);
    
    
    res.render('pages/project/project_create',
        {
            experiments, 
            experiments_select,
            extra_js: ['project_create.bundle.js'],
        });
})

// create action
router.put('/', (req, res) => {
    const {note, name, } = (req.body);
    const model = {note, name};
    console.log(`model: ${JSON.stringify(model, null, 2)}`);
    console.log(`req.body: ${JSON.stringify(req.body, null, 2)}`);
    
    // breed_controller.default.insert(model)
    //     .then(() => {
    //         res.send({
    //             success: true,
    //         });
    //     })
    //     .catch((err) => {
    //         res.status(500).send({
    //             success: false,
    //             err,
    //         });
    //     });
});


// update page
router.get('/:project_id', async (req, res) => {
    const { project_id } = req.params;
    const { project, experiments } = await project_controller
        .get_experiments(project_id);
    res.render('pages/project/project_update',
        { experiments, project });
});

router.delete('/:id', (req, res) => {
    const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;

    const rm_promises = rm_ids.split(',').map((id) => project_controller.delete(id));

    return Promise.all(rm_promises)
        .then(() => {
            res.send({
                success: true,
            });
        })
        .catch((err) => {
            console.log(`err: ${JSON.stringify(err, null, 2)}`);

            res.status(500).send({
                success: false,
                err,
            });
        });
});
module.exports = router;
