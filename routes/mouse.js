const express = require('express');
const router = express.Router();
var path = require('path');
const BlueBird = require('bluebird')
const enum_controller = require(path.join(__dirname, '..', 'controllers/enum'))
const mouse_controller = require(path.join(__dirname, '..', 'controllers/mouse'))
const cage_controller = require(path.join(__dirname, '..', 'controllers/cage'))
const utils = require('./route-utils')

router.get('/mouse', function(req, res) {
    BlueBird.props({
            status: enum_controller.getByEnumTypeCode('MOUSE_STATUS'),
            genotype: enum_controller.getByEnumTypeCode('MOUSE_GENOTYPE'),
            cages: cage_controller.getAll(),
            sex: enum_controller.getByEnumTypeCode('SEX')
        })
        .then(({status, genotype, cages, sex}) => {
            status = utils.selectJSON(status, 'status')
            genotype = utils.selectJSON(genotype, 'genotype')
            cages = cages.map((cage) => {
                return {
                    id: cage.id,
                    description: cage.name
                }
            })
            sex = utils.selectJSON(sex, 'sex')
            cages = utils.selectJSON(cages, 'cage')
            res.render('pages/mouse', {
                status,
                genotype,
                cages,
                sex
            })
        })


});

function pretty_mouse(mouse) {
    return BlueBird.all([
            enum_controller.getByIdMemo(mouse.sex_id),
            enum_controller.getByIdMemo(mouse.genotype_id),
            enum_controller.getByIdMemo(mouse.status_id)
        ])
        .spread((sex, genotype, status) => {
            mouse.sex = sex.description
            mouse.genotype = genotype.description
            mouse.status = status.description
                // convert to relative time
            mouse.dob = utils.relativeTime(mouse.dob)
            mouse.create_timestamp = utils.relativeTime(mouse.create_timestamp)
            mouse.modify_timestamp = utils.relativeTime(mouse.modify_timestamp)
            return mouse
        })
}
router.get('/mice', function(req, res) {
    mouse_controller.getAll().then((items) => {
            return BlueBird.map(items, (item) => {
                return pretty_mouse(item)
            })
        })
        .then((mouse_array) => {
            res.send({
                data: mouse_array
            })
        })


});

module.exports = router;
