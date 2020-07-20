/* eslint-disable @typescript-eslint/camelcase */
import { Router, Request, Response } from 'express';

import molecule_controller from '../controllers/molecule_controller';
import { get_card_data } from './platemap/platemap_routes_logic';


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
router.post('/table', async (req: Request, res: Response) => {
  // log_json(req.body);
  // const draw = parseInt(req.body.draw);
  // const offset = parseInt(req.body.start);
  // const limit = parseInt(req.body.length);
  const {
    draw, start: offset, length: limit, columns, search, order,
  } = req.body;
  // const limit = 100;

  const { molecules, count } = await molecule_controller.some_pretty({
    limit, offset, columns, search, order,
  })
    .catch((err) => {
      console.error(err);
      return { molecules: {}, count: {} };
    });

  res.send({
    data: molecules,
    recordsTotal: count,
    recordsFiltered: count,
    draw,
  });
});


router.get('/:molecule_id', async (req: Request, res: Response) => {
  const { cell, platemap_id } = await molecule_controller.Model.findByPk(req.params.molecule_id, {
    attributes: ['cell', 'platemap_id'],
    raw: true,
  });
  const card_data = await get_card_data(cell, platemap_id);
  const options = { ...card_data, extra_js: ['molecule_view.bundle.js'] };
  res.render('pages/molecule/molecule_view',
    options);
});


router.get('/multi/:molecule_id_list', async (req: Request, res: Response) => {
  const molecule_id_list = req.params.molecule_id_list.split('_');
  const options: { extra_js: string[]; card_data_list: any } = { extra_js: ['molecule_view.bundle.js'], card_data_list: [] };
  const card_data_promise_list = molecule_id_list
    .map((molecule_id) => molecule_controller.Model
      .findByPk(molecule_id, {
        attributes: ['cell', 'platemap_id'],
        raw: true,
      })
      .then(({ cell, platemap_id }) => get_card_data(cell, platemap_id)));

  const card_data_list: object[] = await Promise.all(card_data_promise_list);
  const x = card_data_list.reduce((acc: object[], card_data: object) => {
    acc.push(card_data);
    return acc;
  }, []);
  options.card_data_list = x;
  res.render('pages/molecule/molecule_view_multi',
    options);
});


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
