const db = require('../lib/database')
String.prototype.capitalize = function() {
    return this.replace(/(^|\s|_)([a-z])/g, function(m, p1, p2) {
        return p1 + p2.toUpperCase();
    });
};
// Constructor
class Base_Controller {
    constructor(bar, fname, lname) {
        // always initialize all instance properties
        this.name = bar;
        this.first_name = fname
        this.last_name = lname
    }

}

// export the class instance
module.exports = Base_Controller;
