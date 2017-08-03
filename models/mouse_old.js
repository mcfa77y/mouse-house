const Base_Model = require('./base_model')

class Mouse extends Base_Model {
    constructor({ id, id_alias, genotype_id, dob, sex_id, ear_tag, status_id, notes, create_timestamp, modify_timestamp, cage_id, soft_delete }) {
        super({ id, create_timestamp, modify_timestamp, soft_delete })
        this.genotype_id = parseInt(genotype_id)
        this.dob = dob
        this.sex_id = parseInt(sex_id)
        this.ear_tag = parseInt(ear_tag)
        this.status_id = parseInt(status_id)
        this.notes = notes
        this.cage_id = parseInt(cage_id)
    }
}
module.exports = Mouse;