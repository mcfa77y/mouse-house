import {setup_table, setup_list_page_buttons} from './cs-model-common'
import {column_names, model_name} from './cs-cage-common'

$(function() {
    const table = setup_table({ model_name, column_names, hide_id_column: true })
    setup_list_page_buttons(model_name, table)
})