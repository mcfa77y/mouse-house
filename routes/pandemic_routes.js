const express = require('express');

const router = express.Router();

// const Logger = require('bug-killer');
const BlueBird = require('bluebird');
const _ = require('underscore');
const isFalsey = require('falsey');

// const utils = require('./utils_routes');
const {
    select_json,
    log_json,
    getErrorGif,
    cool_face,
    today,
} = require('./utils_routes');

router.get('/', (req, res) => {
    res.render('pages/pandemic/index', {
        extra_js: ['pandemic_index.bundle.js'],
    });
});



module.exports = router;