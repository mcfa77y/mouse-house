const cacher = require('sequelize-redis-cache');
const redis = require('redis');

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const redis_url = process.env.REDIS_URL;
const redis_client = redis.createClient(redis_url);

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];
const db = {};
const ONE_HOUR = 60 * 60;
let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
    db['cached_' + model.name] = cacher(sequelize, redis_client)
      .model(model.name)
      .ttl(ONE_HOUR);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
