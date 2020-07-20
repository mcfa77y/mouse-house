import { Router, Request, Response } from 'express';
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');

// import experiment_controller from '../controllers/experiment_controller';
import platemap_controller from '../../controllers/platemap_controller';
import { create_platemap_grid, get_card_data } from './platemap_routes_logic';
const PARTIALS_DIR = path.join(__dirname, '../../../views/partials/platemap/');

const router: Router = Router();

// const grid_table_template_uri = path.join(PARTIALS_DIR, 'grid_table.hbs');
// const source = fs.readFileSync(grid_table_template_uri, 'utf-8');
// const grid_table_template = hbs.handlebars.compile(source);

// const CARD_SOURCE = fs.readFileSync(path.join(PARTIALS_DIR, 'platemap_card.hbs'), 'utf-8');
const CARD_SOURCE = fs.readFileSync(path.join(PARTIALS_DIR, 'platemap_card_tabs.hbs'), 'utf-8');
const CARD_HTML_TEMPLATE = hbs.handlebars.compile(CARD_SOURCE);


router.get('/', async (req: Request, res: Response) => {
  res.redirect('../experiments');
  res.end();
});


/*
 get platemap
*/
router.get('/:platemap_id', async (req: Request, res: Response) => {
  const { grid, column_headers, platemap_db } = await create_platemap_grid(req, res);
  res.render('pages/platemap/platemap', {
    extra_js: ['platemap.bundle.js'],
    grid,
    column_headers,
    platemap: {
      name: platemap_db.name,
      id: platemap_db.id,
    }
  });
});

// create card
router.post('/card', async (req: Request, res: Response) => {
  const {
    cell, platemap_id,
  } = req.body;
  const card_data = await get_card_data(cell, platemap_id);
  const card_html = CARD_HTML_TEMPLATE(card_data);

  // res.render('pages/grid/grid_view', dt);
  res.status(200).send({
    html: card_html,
  });

});

// platemap save tag
router.post('/tags/', (req, res) => {
  const { tags, platemap_id } = req.body;
  const model = {
    tags,
    id: platemap_id
  }
  platemap_controller.update(model).then((resutl) => {
    // const config_map = add_config(req);
    // save_config_to_disk(config_map, CONFIG_DIR);
    res.status(200).send({
      success: true,
    });
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        success: false,
        err
      });
    })

});

export default router;