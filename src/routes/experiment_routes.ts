import { Router, Request, Response } from 'express';
import { falsy as isFalsey }  from 'is_js';

import experiment_controller from '../controllers/experiment_controller';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  const experiments = await experiment_controller.all_pretty();
  res.render('pages/experiment/experiment_list', {
    extra_js: ['experiment_list.bundle.js'],
    experiments,
  });
});


router.get('/create', async (req: Request, res: Response) => {
  
  res.render('pages/experiment/experiment_create', {
    extra_js: ['experiment_create.bundle.js'],
    
  });
});

router.get('/:experiment_id', async (req: Request, res: Response) => {
  const { projects, experiment } = await experiment_controller.get_projects(req.params.experiment_id);
  res.render('pages/experiment/experiment_update',
    { experiment, projects });
});


router.delete('/:id', (req, res) => {
  const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;

  const rm_promises = rm_ids.split(',').map((id) => experiment_controller.delete(id));

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

export default router;