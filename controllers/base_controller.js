const db = require('../lib/database')
const squel = require('squel')
const memoize = require('memoizee');
const memoizeMethods = require('memoizee/methods');

const d = require('d');

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
    getAll(){
    	const query = squel.select()
            .from(this.name)
            .toString()
        return db.any(query)
    }
    getById(_id){
        const query = squel.select()
            .from(this.name)
            .where('id = ?', _id)
            .toString()
        return db.one(query)
    }
}

// export the class instance
exports.Base_Controller = Base_Controller;

exports.db = db
exports.squel = squel
exports.memoize = memoize
exports.memoizeMethods = memoizeMethods
exports.d = d
