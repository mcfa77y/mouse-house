const BlueBird = require('bluebird')

// const loopback = require('loopback');
// let DB = {}
// const my_ds = loopback.createDataSource('postgresql', {
//         "host": "127.0.0.1",
//         "port": 5432,
//         "url": "postgres://postgres:postgres@127.0.0.1:5432/postgres",
//         "database": "postgres",
//         "password": "postgres",
//         "user": "postgres"
//     })
// DB = {
// 	data_source : my_ds,
// 	discoverAndBuildModels: BlueBird.promisify(my_ds.discoverAndBuildModels, {context: my_ds})
// }
// module.exports = DB


const options = {
	promiseLib: BlueBird,
	 // global event notification;
    error: (error, e) => {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.log("CN:", e.cn);
            console.log("EVENT:", error.message || error);
        }
    }
}
const pgp = require('pg-promise')(options);

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
  user: 'postgres', //env var: PGUSER
  database: 'postgres', //env var: PGDATABASE
  password: 'postgres', //env var: PGPASSWORD
  host: '127.0.0.1', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed

};
const db = pgp(config)
module.exports = db