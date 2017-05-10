const express = require('express');
const router = express.Router();
var path = require('path');
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
function logJSON(json){
	console.log(JSON.stringify(json, null, 4))
}
router.get('/breed', function(request, response) {
    enum_controller.getByEnumTypeCode('SEX')
        .then(logJSON)
    enum_controller.foreignKeys()
        .then(logJSON)
     enum_controller.modelProperties()
        .then(logJSON)
});

module.exports = router;
