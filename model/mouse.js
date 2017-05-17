class Mouse extends Base_Model {
    constructor(({id, genotype_id, dob, sex_id, ear_tag, status_id, notes, create_timestamp, modify_timestamp, soft_delete})) {
        // always initialize all instance properties
        this.id = id
        this.genotype_id = genotype_id
        this.dob = dob
        this.sex_id = sex_id
        this.ear_tag = ear_tag
        this.status_id = status_id
        this.notes = notes
        this.create_timestamp = create_timestamp
        this.modify_timestamp = modify_timestamp
        this.soft_delete = soft_delete
    }
}
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