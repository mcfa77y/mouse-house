const Base_Model = require('./base_model')

class Cage extends Base_Model {
    constructor({ id, id_alias, create_timestamp, modify_timestamp, soft_delete, type_id, setup_date, end_date, update_date, mouse_ids, notes, }) {
        super({ id, create_timestamp, modify_timestamp, soft_delete })
        this.type_id = parseInt(type_id)
        this.setup_date = setup_date
        this.end_date = end_date
        this.update_date = update_date
        this.mouse_ids = mouse_ids
        this.notes = notes
    }
}
module.exports = Cage;

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
