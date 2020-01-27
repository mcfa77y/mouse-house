const express = require('express');
const { falsy: isFalsey } = require('is_js');
const multer = require('multer');

const { select_json, getErrorGif } = require('./utils_routes');
const project_controller = require('../controllers/project_controller');
const experiment_controller = require('../controllers/experiment_controller');

const upload = multer();
const router = express.Router();

// common stuff
function create_model({ name, note, experiment_ids }: { name: string, note: string, experiment_ids: string }, add_id_key = false) {
    let model = { name, note };

    let experiments = [];
    if (!isFalsey(experiment_ids)) {
        experiments = experiment_ids.split(',').map((id) => {
            if (add_id_key) {
                return { 'id': parseInt(id) }
            }
            else {
                return parseInt(id)
            }
        });
        model = Object.assign(model, { experiments });
    }
    return model;
}

// end common stuff

// list page
router.get('/', async (req, res) => {
    const projects = await project_controller.all_pretty();
    res.render('pages/project/project_list', {
        extra_js: ['project_list.bundle.js'],
        projects,
    });
});

// create page
router.get('/create', async (req, res) => {
    const experiments = await experiment_controller.all_pretty();
    const experiments_select = select_json(experiments
        .map((model) => ({ id: model.id, description: model.name })));

    res.render('pages/project/project_create',
        {
            experiments,
            experiments_select,
            extra_js: ['project_create.bundle.js'],
        });
});


// create action
// ajax response
router.put('/', upload.none(), (req, res) => {
    const model = create_model(req.body);

    project_controller.insert(model)
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

// update page
router.get('/:project_id', async (req, res) => {
    const { project_id } = req.params;
    const { project, experiments } = await project_controller
        .get_experiments(project_id);

    const all_experiments = await experiment_controller.all_pretty();
    const all_experiments_select = select_json(all_experiments
        .map((model) => ({ id: model.id, description: model.name })));

    res.render('pages/project/project_update',
        {
            project,
            experiments: all_experiments,
            experiments_select: all_experiments_select,
            extra_js: ['project_update.bundle.js'],
        });
});


// update action
// ajax response
router.post('/', upload.none(), (req, res) => {
    const model = create_model(req.body);

    project_controller.update(model)
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

// delete action
// ajax response
router.delete('/:id', (req, res) => {
    const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;

    const rm_promises = rm_ids.split(',').map((id) => project_controller.delete(id));

    return Promise.all(rm_promises)
        .then(() => {
            res.send({ success: true });
        })
        .catch(async (error) => {
            const errorImageUrl = await getErrorGif();
            res.render('error', { error, errorImageUrl });
        });
});

// module.exports = router;
export default router;
