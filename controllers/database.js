const BlueBird = require('bluebird')

const loopback = require('loopback');
let DB = {}
const my_ds = loopback.createDataSource('postgresql', {
        "host": "127.0.0.1",
        "port": 5432,
        "url": "postgres://postgres:postgres@127.0.0.1:5432/postgres",
        "database": "postgres",
        "password": "postgres",
        "user": "postgres"
    })
DB = {
	data_source : my_ds,
	discoverAndBuildModels: BlueBird.promisify(my_ds.discoverAndBuildModels, {context: my_ds})
}
module.exports = DB