import { Router, Request, Response } from 'express';
import { falsy as isFalsey } from 'is_js';
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');

// import experiment_controller from '../controllers/experiment_controller';
import platemap_controller from '../controllers/platemap_controller';
import molecule_controller from '../controllers/molecule_controller';
const PARTIALS_DIR = path.join(__dirname, '../../views/partials/grid/');

const router: Router = Router();

const grid_table_template_uri = path.join(PARTIALS_DIR, 'grid_table.hbs');
const source = fs.readFileSync(grid_table_template_uri, 'utf-8');
const grid_table_template = hbs.handlebars.compile(source);


router.get('/', async (req: Request, res: Response) => {
  //   const experiments = await experiment_controller.all_pretty();
  //   res.render('pages/experiment/experiment_list', {
  //     extra_js: ['experiment_list.bundle.js'],
  //     experiments,
  //   });
});


/*
 get platemap
*/
router.get('/:platemap_id', async (req: Request, res: Response) => {
  const platemap_db = await platemap_controller.get(req.params.platemap_id);
  const molecule_db_list = await platemap_db.getMolecules();
  // reshape map in to rows/cols
  const grid = {};
  for (let molecule of molecule_db_list) {
    let row_index = molecule.y - 1;
    let col_index = molecule.x - 1;
    let row = grid[row_index];
    if (row == undefined) {
      grid[row_index] = []
      row = grid[row_index]
    }

    let col = row[col_index];
    if (col == undefined) {
      grid[row_index][col_index] = molecule.name;
    }
  }
  res.render('pages/platemap/platemap', {
    extra_js: ['platemap.bundle.js'],
    grid,
    column_headers: grid[0],
    platemap_name: platemap_db.name
  });
});

// save tag
router.post('/tags/', (req, res) => {
  const config_map = add_config(req);
  save_config_to_disk(config_map, CONFIG_DIR);
  res.status(200).send({
      success: true,
  });
});

export default router;