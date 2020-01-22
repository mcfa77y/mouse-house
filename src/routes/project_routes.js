const express = require('express');
const BlueBird = require('bluebird');
const fs = require('fs');
const { falsy: isFalsey } = require('is_js');

const project_controller = require('../controllers/project_controller');

const router = express.Router();
BlueBird.promisifyAll(fs);

router.get('/', async (req, res) => {
    let config_map = [];
    if (req.session.config_map) {
        ({ config_map } = req.session);
    } else {
        req.session.config_map = config_map;
        // res.cookie('config_map', config_map);
    }
    const projects = await project_controller.all_pretty();
    res.render('pages/project/project_list', {
        extra_js: ['project_list.bundle.js'],
        projects,
    });
});

router.get('/:project_id', async (req, res) => {
    const { project, experiments } = await project_controller
        .get_experiments(req.params.project_id);
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
