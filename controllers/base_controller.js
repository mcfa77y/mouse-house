const db = require('../lib/database')
const squel = require('squel')

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

}

// export the class instance
exports.Base_Controller = Base_Controller;

exports.db = db
exports.squel = squel