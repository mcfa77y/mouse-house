import { Router, Request, Response } from 'express';
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');

import molecule_controller from '../controllers/molecule_controller';
import { get_card_data } from './platemap/platemap_routes_logic';
import molecule from '../database/models/molecule';

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
  const { draw, start: offset, length: limit, columns, search, order } = req.body
  // const limit = 100;

  const { molecules, count } = await molecule_controller.some_pretty({ limit, offset, columns, search, order })
    .catch((err) => {
      console.error(err)
      return { molecules: {}, count: {} }
    }
    );

  res.send({
    data: molecules,
    recordsTotal: count,
    recordsFiltered: count,
    draw
  });


});


router.get('/:molecule_id', async (req: Request, res: Response) => {
  const { cell, platemap_id } = await molecule_controller.Model.findByPk(req.params.molecule_id, {
    attributes: ['cell', 'platemap_id'],
    raw: true
  });
  const card_data = await get_card_data(cell, platemap_id);
  // const card_html = CARD_HTML_TEMPLATE(card_data);

  res.render('pages/molecule/molecule_view',
    card_data);
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