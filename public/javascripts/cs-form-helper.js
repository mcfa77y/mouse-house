$(function() {
    const form_helper = {
        extract_id_val: (x) => {
            return { val: $(x).val(), id: $(x).attr('id') }
        },

        get_ids_vals: (fieldId) => {
            let fields = $('#' + fieldId)
            let selectVals = fields.find('select').toArray().map(this.extract_id_val)
            let radioVals = fields.find('input:checked').toArray().map(this.extract_id_val)
            let textVals = fields.find('input:text').toArray().map(this.extract_id_val)
            let textAreaVals = fields.find('textArea').toArray().map(this.extract_id_val)
            return [].concat(fields, selectVals, radioVals, textVals, textAreaVals)
        }
    }
})
