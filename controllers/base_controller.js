const squel = require('squel')
const d = require('d');
const memoize = require('memoizee');
const memoizeMethods = require('memoizee/methods');
const db = require('../lib/database')
const utils = require('./utils_controller')

String.prototype.capitalize = function() {
    return this.replace(/(^|\s|_)([a-z])/g, function(m, p1, p2) {
        return p1 + p2.toUpperCase();
    });
};

// Constructor
class Base_Controller {
    constructor(_name) {
        // always initialize all instance properties
        this.name = _name;
    }
    all(){
    	const query = squel.select()
            .from(this.name)
            .toString()
        return db.any(query)
    }
    by_id(_id){
        const query = squel.select()
            .from(this.name)
            .where('id = ?', _id)
            .toString()
        return db.one(query)
    }
    insert(row){
        row.create_timestamp = utils.stringTime(new Date())
        row.modify_timestamp = row.create_timestamp
        const query = squel.insert()
            .into(this.name)
            .setFields(row)
            .toString()
        return db.any(query)
    }
    delete(_id){
        const query = squel.delete()
            .from(this.name)
            .where('id = ?', _id)
            .toString()
        return db.any(query)
    }
}

// export the class instance
exports.Base_Controller = Base_Controller;

exports.db = db
exports.squel = squel
exports.memoize = memoize
exports.memoizeMethods = memoizeMethods
exports.d = d
