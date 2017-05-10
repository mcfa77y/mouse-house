const express = require('express');
const router = express.Router();
var path = require('path');
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))

router.get('/breed', function(request, response) {
    enum_controller.getByEnumTypeCode('SEX')
        .then((result) => {
            console.log('breed-route: ' + result)
        })
    enum_controller.foreignKeys()
        .then((x) => {
            console.log(JSON.stringify(x, null, 3))
        })
});

module.exports = router;
