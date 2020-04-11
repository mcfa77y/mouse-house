import express from 'express';
import { falsy as isFalsey } from 'is_js';
import multer from 'multer';

import  {select_json, getErrorGif} from './utils_routes';
import project_controller from '../controllers/project_controller';
import experiment_controller from '../controllers/experiment_controller';

const upload = multer();
const router = express.Router();

// common stuff
function create_model({ name, note, experiment_ids }: {name: string, note:string, experiment_ids: string}) {
    return {
        name,
        note,
        experiments: experiment_ids.split(',').map(id => parseInt(id)),
    };
}

function update_model({ id, name, note, experiment_ids }: {id: string, name: string, note:string, experiment_ids: string}) {
    return {
        id,
        name,
        note,
        experiments: experiment_ids.split(',').map(id => parseInt(id)),
    };
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
    const experiments_select = select_json(experiments
        .map((model) => ({ id: model.id, description: model.name })));
    project.experiment_ids = experiments.map((experiment) => experiment.id + "");
    const all_experiments = await experiment_controller.all_pretty();

    res.render('pages/project/project_update',
        {
            project,
            experiments: all_experiments,
            experiments_select,
            extra_js: ['project_update.bundle.js'],
        });
});


// update action
// ajax response
router.post('/', upload.none(), (req, res) => {
    const model = update_model(req.body);

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