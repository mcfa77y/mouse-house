const express = require('express');
const {falsy: isFalsey} = require('is');

const router = express.Router();
const BlueBird = require('bluebird');

const enum_controller = require('../controllers/enum_controller');
const mouse_controller = require('../controllers/mouse_controller');
const cage_controller = require('../controllers/cage_controller');

const { build_note } = require('./utils_routes');

module.exports = {
    get_cage_inputs: () => BlueBird.props({
        mice: mouse_controller.all_pretty(),
        cage_type: enum_controller.by_type('CAGE_TYPE'),
    }),

    create_model: (_model) => {
        const model = _model;
        model.type = { id: _model.type_id };
        model.note = build_note(_model);
        model.mice = _model.mouse_ids.map(id => ({ id }));
        return model;
    },
};
