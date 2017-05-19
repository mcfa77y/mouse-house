const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse'))
const cage_controller = require(path.join(__dirname, '..', 'controllers/cage'))
const util = require('./route-utils')

router.get('/cage', function(req, res) {
    BlueBird.props({
            mice: mouse_controller.all(),
            cage_type: enum_controller.by_code('CAGE_TYPE')
        })
        .then(({mice, cage_type}) => {
            mice = mice.map((mouse)=>{
                return {id: mouse.id, description: mouse.id}
            })
            mice = util.selectJSON(mice, 'mouse_ids', 'mice')
            cage_type = util.selectJSON(cage_type, 'cage_type')
            res.render('pages/cage', {
                mice,
                cage_type
            })
        })


});

module.exports = router;
