// @ts-nocheck

const { Sequelize } = require('sequelize');

// const project = require('./old_models/project');
const experiment = require('./experiment');
// const project_experiment = require('./old_models/project_experiment');
const platemap = require('./platemap');
const product_info = require('./product_info');
const molecule = require('./molecule');
const image_metadata = require('./image_metadata');

const env = 'local';
// const env = process.env.NODE_ENV || 'development';

console.log(`enter index.js model: ${__dirname}`);

const config = require('../config/config.json')[env];

const db = {};
let sequelize;

if (process.env.NODE_ENV === 'production') {
    console.log('using prod for db');

    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: true,
        },
    });
} else if (process.env.NODE_ENV === 'test') {
    console.log('using prod for db');
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: true,
        },
    });
} else {
    console.log(`using default config for db\n${JSON.stringify(config, null, 2)}`);
    // console.log(`config: ${JSON.stringify(config, null, 2)}`);
    // config.dialect = "postgres" as Dialect;
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const modules = [
    // project,
    experiment,
    // project_experiment,
    platemap,
    product_info,
    molecule,
    image_metadata,
];

// Initialize models
modules.forEach((module) => {
    const model = module.default(sequelize, Sequelize);
    db[model.name] = model;
    console.log(`added Model: ${model.name}`);
});

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
