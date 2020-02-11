import { Router, Request, Response } from 'express';
import { falsy as isFalsey }  from 'is_js';

import molecule_controller from '../controllers/molecule_controller';
import { log_json } from '../controllers/utils_controller';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  // const molecules = await molecule_controller.all_pretty();
  res.render('pages/molecule/molecule_list', {
    extra_js: ['molecule_list.bundle.js'],
    // molecules,
  });
});


/*
send table ajax response
*/
router.post('/table', (req: Request, res: Response) => {
  log_json(req.body);
  // const draw = parseInt(req.body.draw);
  // const offset = parseInt(req.body.start);
  // const limit = parseInt(req.body.length);
  const {draw, start: offset, length: limit, columns, search, order} = req.body
  // const limit = 100;
  
   molecule_controller.some_pretty({limit, offset, columns, search, order}).then(({molecules, count}) => {
     res.send( {
       data: molecules,
       recordsTotal: count,
       recordsFiltered: count,
       draw
     });
   })
  });
  

// router.get('/:molecule_id', async (req: Request, res: Response) => {
//   const { projects, molecule } = await molecule_controller.get_projects(req.params.molecule_id);
//   res.render('pages/molecule/molecule_update',
//     { molecule, projects });
// });


// router.delete('/:id', (req, res) => {
//   const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;

//   const rm_promises = rm_ids.split(',').map((id) => molecule_controller.delete(id));

//   return Promise.all(rm_promises)
//       .then(() => {
//           res.send({
//               success: true,
//           });
//       })
//       .catch((err) => {
//           console.log(`err: ${JSON.stringify(err, null, 2)}`);

//           res.status(500).send({
//               success: false,
//               err,
//           });
//       });
// });

export default router;