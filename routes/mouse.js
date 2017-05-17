const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse'))
const cage_controller = require(path.join(__dirname, '..', 'controllers/cage'))
const utils = require('./route-utils')

/*
// http://mherman.org/blog/2016/03/13/designing-a-restful-api-with-node-and-postgres/
router.get('/api/mice', db.getAllPuppies);
router.get('/api/mice/:id', db.getSinglePuppy);
router.post('/api/mice', db.createPuppy);
router.put('/api/mice/:id', db.updatePuppy);
router.delete('/api/mice/:id', db.removePuppy);
*/

router.get('/mouse', function(req, res) {
    BlueBird.props({
            status: enum_controller.getByEnumTypeCode('MOUSE_STATUS'),
            genotype: enum_controller.getByEnumTypeCode('MOUSE_GENOTYPE'),
            cages: cage_controller.all(),
            sex: enum_controller.getByEnumTypeCode('SEX'),
            mice: mouse_controller.all_pretty()
        })
        .then(({status, genotype, cages, sex, mice}) => {
            status = utils.selectJSON(status, 'status_id')
            genotype = utils.selectJSON(genotype, 'genotype_id')
            cages = cages.map((cage) => {
                return {
                    id: cage.id,
                    description: cage.name
                }
            })
            sex = utils.selectJSON(sex, 'sex_id')
            cages = utils.selectJSON(cages, 'cage_id')
            res.render('pages/mouse', {
                status,
                genotype,
                cages,
                sex,
                mice
            })
        })


});

router.get('/mice', function(req, res) {
    mouse_controller.all_pretty()
        .then((mouse_array) => {
            res.send({
                data: mouse_array
            })
        })
});

router.post('/mouse', function(req, res) {
    utils.logJSON(req.body)
    mouse_controller.insert(req.body).then((x)=>{
        res.send({success:true})
    })
    .catch((err)=>{
        res.status(500).send({success: false, err})
    })
});

module.exports = router;
