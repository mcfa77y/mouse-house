const express = require('express');
const router = express.Router();
var path = require('path');
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))

router.get('/breed', function(request, response) {
    enum_controller.getByEnumTypeCode('SEX')
        .then((result) => {
            console.log('breed-route: ' + result)
        })
});

module.exports = router;
