
const fs = require('fs');
const path = require('path');
const {Sequelize} = require('sequelize');

// const basename = path.basename(module.filename);
const basename = 'index.js';
const env = process.env.NODE_ENV || 'development';
// const config = require(`${__dirname}/../config/config.json`)[env];
const readJson = require('r-json');
console.log("enter index.js model: "+__dirname);
// const foo = __dirname;
// const bar = path.resolve(foo, '/../config/config.json');
// const config = readJson(bar)[env];
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
    console.log('using default config for db');
    // console.log(`config: ${JSON.stringify(config, null, 2)}`);
    
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// const good_guys = ['project.js', 'experiment.js', 'project_experiment.js']

// fs
//     .readdirSync(__dirname)
//     .filter((file) => {
//         const keep = (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
//         // console.log(`file: ${file} - ${keep}`);
//         return keep
//     })
//     .filter((file) => {
//         const keep = good_guys.indexOf(file) >= 0;
//         // console.log(`file: ${file} - ${keep}`);
//         return keep
//     })
//     .forEach((file) => {
//         // const foo = __dirname.substring(4);
//         const foo = __dirname;
//         const bar = path.join(__dirname, file);
//         console.log(`start import file: ${bar}`);
//         const model = sequelize.import(bar);
//         db[model.name] = model;
//         console.log("end import");
        
//     });

let modules = [
    require('./project'),
    require('./experiment'),
    require('./project_experiment')
  ];

// Initialize models
modules.forEach((module) => {
    const model = module.default(sequelize, Sequelize);
    db[model.name] = model;
    console.log('added Model: ' + model.name);
});

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
