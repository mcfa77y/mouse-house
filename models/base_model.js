// const moment = require('moment')().format('MM/DD/YYYY')
// Constructor

class Base_Model {
    constructor({ id, create_timestamp, modify_timestamp, soft_delete }) {
        this.id = parseInt(id)
        if (!create_timestamp && create_timestamp != undefined) {
            this.create_timestamp = create_timestamp
        }
        if (!modify_timestamp && modify_timestamp != undefined) {
            this.modify_timestamp = modify_timestamp
        }
        if (!soft_delete || soft_delete == undefined) {
            soft_delete = 0
        }
        this.soft_delete = parseInt(soft_delete)
    }

}

// export the class instance
module.exports = Base_Model;
