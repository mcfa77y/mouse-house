const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse'))

function logJSON(json) {
    console.log(JSON.stringify(json, null, 4))
}
router.get('/mouse', function(req, res) {
    BlueBird.all([
            mouse_controller.getMiceForSelect()
        ])
        .spread((m) => {
            logJSON(m)
            let mm = m
            res.render('pages/mouse', {
                mice_data: mm
            })
        })


});

module.exports = router;
