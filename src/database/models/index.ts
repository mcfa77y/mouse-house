// import * as cacher from 'sequelize-redis-cache';
import redis from 'redis';

// import fs from 'fs';
import path from 'path';
import Sequelize from "sequelize";
import { Mouse_Factory } from './Mouse';
import { Breed_Factory } from './Breed';
import { Enum_Factory } from './Enum';
import { Cage_Factory } from './Cage';
import { Note_Factory } from './Note';
import { Breed_Mouse_Factory } from './Breed_Mouse';
import { DbInterface } from '../../typings/DbInterface';


const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];

const redis_url: string = process.env.REDIS_URL || config[env].redis_url;
const redis_client = redis.createClient(redis_url);

const basename = path.basename(module.filename);



const ONE_HOUR = 60 * 60;
let sequelize:any;

if (process.env.NODE_ENV === 'production') {
    const database_url: string = process.env.DATABASE_URL || config.production.database_url;
    sequelize = new Sequelize(database_url, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: true,
        },
    });
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

export const db:DbInterface  = {
    sequelize,
    Sequelize,
    Mouse: Mouse_Factory(sequelize),
    Breed: Breed_Factory(sequelize),
    Enum: Enum_Factory(sequelize),
    Cage: Cage_Factory(sequelize),
    Note: Note_Factory(sequelize),
    Breed_Mouse: Breed_Mouse_Factory(sequelize),
};

// fs
//     .readdirSync(__dirname)
//     .filter((file: string) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
//     .forEach((file: string) => {
//         const model = sequelize.import(path.join(__dirname, file));
//         db[model.name] = model;
//         db[`cached_${model.name}`] = cacher(sequelize, redis_client)
//             .model(model.name)
//             .ttl(ONE_HOUR);
//     });

Object.keys(db).forEach((modelName: string) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// export const db = db;
// export default db;
