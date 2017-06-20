// const moment = require('moment')().format('MM/DD/YYYY')
// Constructor

class Base_Model {
    constructor({ id, create_timestamp, modify_timestamp, soft_delete }) {
        this.id = parseInt(id)
        this.create_timestamp = create_timestamp
        this.modify_timestamp = modify_timestamp
        this.soft_delete = parseInt(soft_delete)
    }

}

// export the class instance
module.exports = Base_Model;
