const express = require('express');
const isFalsey = require('falsey');

const router = express.Router();
const BlueBird = require('bluebird');

const enum_controller = require('../controllers/enum_controller');
const mouse_controller = require('../controllers/mouse_controller');
const cage_controller = require('../controllers/cage_controller');

const { build_note } = require('./utils_routes');

module.exports = {
    create_model: (_model) => {
        const model = _model;
        model.type = {id: _model.type_id};
        model.note = build_note(_model);
        model.mice = _model.mouse_ids.map((id) => {
            return {id};
        })
        return model;
    },
    foo_bar: () => {
        console.log('hi');
    }
};
