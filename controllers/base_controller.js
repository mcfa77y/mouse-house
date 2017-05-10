const db = require('./database')
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


    models() {
        return db.discoverAndBuildModels(this.name, {
                visited: {},
                associations: true
            })
            .then((models) => {
                return models[this.name.toLowerCase().capitalize().replace('_', '')]
            })
    }

    modelProperties() {
        return db.data_source.discoverModelProperties(this.name)
    }
    foreignKeys() {
        return db.data_source.discoverForeignKeys(this.name)
    }
}

// export the class instance
module.exports = Base_Controller;
