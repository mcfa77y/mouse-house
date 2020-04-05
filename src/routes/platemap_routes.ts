import { Router, Request, Response } from 'express';
import { falsy as isFalsey } from 'is_js';
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');

// import experiment_controller from '../controllers/experiment_controller';
import platemap_controller from '../controllers/platemap_controller';
import molecule_controller from '../controllers/molecule_controller';
const PARTIALS_DIR = path.join(__dirname, '../../views/partials/platemap/');

const router: Router = Router();

// const grid_table_template_uri = path.join(PARTIALS_DIR, 'grid_table.hbs');
// const source = fs.readFileSync(grid_table_template_uri, 'utf-8');
// const grid_table_template = hbs.handlebars.compile(source);

const CARD_SOURCE = fs.readFileSync(path.join(PARTIALS_DIR, 'platemap_card_beta.hbs'), 'utf-8');
const CARD_HTML_TEMPLATE = hbs.handlebars.compile(CARD_SOURCE);


router.get('/', async (req: Request, res: Response) => {
  res.redirect('../experiments');
  res.end();
});


/*
 get platemap
*/
router.get('/:platemap_id', async (req: Request, res: Response) => {
  const platemap_db = await platemap_controller.get(req.params.platemap_id);
  if (platemap_db == false) {
    // TODO: return missing table page
  }
  const molecule_db_list = await platemap_db.getMolecules()
    .catch((err) => {
      console.error(err);
    });
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
      grid[row_index][col_index] = { name: molecule.name };
    }
  }

  // get tag info for cell
  /*
  [{"tag": "green", "row_col": "10_3"},
   {"tag": "green", "row_col": "10_5"},
   {"tag": "green", "row_col": "11_4"},
   {"tag": "green", "row_col": "12_3"},
   {"tag": "green", "row_col": "12_5"}]
  */
  if (platemap_db.tags) {
    for (let cell of platemap_db.tags) {
      const [row, col] = cell.row_col.split('_').map((x) => parseInt(x, 10));
      grid[row][col].tag = cell.tag;
    }
  }
  let column_headers = [];
  let offset = 'A'.charCodeAt(0);
  for (let i = 0; i < grid[0].length; i++) {
    column_headers.push(String.fromCharCode(i + offset));
  }
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
router.post('/card', async (req, res) => {
  const {
    index, platemap_id,
  } = req.body;

  const [row, col] = index.split('_').map((x) => parseInt(x, 10) + 1);

  const molecule_db = await molecule_controller.Model.findOne({
    attributes: ['cell',
      'form',
      'info',
      'max_solubility',
      'molarity_mm',
      'molarity_unit',
      'name',
      'pathway',
      'smiles',
      'targets',
      'weight',
      'x',
      'y'],
    where: {
      x: col,
      y: row,
      platemap_id
    },
    include: [{
      association: molecule_controller.Model.Product_Info,
      // {
      // model: molecule_controller.Model.Product_Info,
      attributes: ['barcode', 'cas_number', 'catalog_number', 'url', ]
      // }
    }],
  })
  
  if (molecule_db !== undefined) {
    const molecule_field_skip = new Set(['product_info']);
    const molecule_cs = Object.keys(molecule_db.dataValues)
      .filter((key) => !molecule_field_skip.has(key))
      .reduce((acc, key) => {
        acc.push({ name: key, class_name: key, value: molecule_db.dataValues[key] });
        return acc;
      }, []);
    const product_info_db = molecule_db.product_info;
    const product_info_cs = Object.keys(product_info_db.dataValues)
      .reduce((acc, key) => {
        acc.push({ name: key, class_name: key, value: product_info_db.dataValues[key] });
        return acc;
      }, []);
    const card_data = {
      molecule_meta_data: [...molecule_cs, ...product_info_cs],
      name: `${molecule_db.name}`,
      // id: path.parse(file).name,
      // row_zip,
      // column_headers: data.column_headers,
    };
    const card_html = CARD_HTML_TEMPLATE(card_data);

    // res.render('pages/grid/grid_view', dt);
    res.status(200).send({
      html: card_html,
    });
  }
  else {
    res.status(500);
  }

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