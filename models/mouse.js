const Base_Model = require('./base_model')

class Mouse extends Base_Model {
    constructor({id, genotype_id, dob, sex_id, ear_tag, status_id, notes, create_timestamp, modify_timestamp, soft_delete}) {
        super({id, create_timestamp, modify_timestamp, soft_delete})
        this.genotype_id = parseInt(genotype_id)
        this.dob = dob
        this.sex_id = parseInt(sex_id)
        this.ear_tag = parseInt(ear_tag)
        this.status_id = parseInt(status_id)
        this.notes = notes
    }
}
module.exports = Mouse;

/*
{_id,
            _ear_tag,
            _dob,
            _genotype,
            _sex,
            _notes,
            _status,
            _create_timestamp,
            _modify_timestamp}
            */