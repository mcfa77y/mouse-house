import { Router, Request, Response } from 'express';
import experiment_controller from '../controllers/experiment_controller';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  const experiments = await experiment_controller.all_pretty();
  res.render('pages/experiment/experiment_list', {
    extra_js: ['experiment_list.bundle.js'],
    experiments,
  });
});

router.get('/:experiment_id', async (req: Request, res: Response) => {
  const { projects, experiment } = await experiment_controller.get_projects(req.params.experiment_id);
  res.render('pages/experiment/experiment_update',
    { experiment, projects });
});

export default router;