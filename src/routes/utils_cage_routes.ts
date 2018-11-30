import P from 'bluebird';
const BlueBird = P.Promise;

import { Enum_Controller } from '../controllers/enum_controller';
import { Mouse_Controller } from '../controllers/mouse_controller';

const { build_note } = require('./utils_routes');

export const cage_utils = {
    get_cage_inputs: () => BlueBird.props({
        mice: Mouse_Controller.all_pretty(),
        cage_type: Enum_Controller.by_type('CAGE_TYPE'),
    }),

    create_model: (_model: any) => {
        const model = _model;
        model.type = { id: _model.type_id };
        model.note = build_note(_model);
        model.mice = _model.mouse_ids.map((id: number) => ({ id }));
        return model;
    },
};
