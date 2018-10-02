const d = require('d');
const memoizeMethods = require('memoizee/methods');
import { Base_Controller } from './base_controller';
// const { Enum } = require('../database/models');
import db from '../database/models';
const { Enum } = db;
class Controller extends Base_Controller {
    by_type(_code: string) {
        return Enum.findAll({
            attributes: ['id', 'description'],
            where: { type: _code },
        });
    }

    by_type_map(_code: string) {
        return Enum.findAll({
            attributes: ['id', 'description'],
            where: { type: _code },
        })
            .then((enums) => {
                const enum_id_map = {};
                enums.forEach((enoom) => {
                    enum_id_map[enoom.description] = enoom.id;
                });
                return enum_id_map;
            });
    }
    get model() {
        return Enum;
    }
    constructor(_Model){
        super(_Model);
    }
}

const memoize_methods = {
    // by_type: d(_code => {
    //     return Enum.findAll({
    //         attributes: ['id', 'description'],
    //         where: { type: _code }
    //     })
    // }, { promise: true }),

    // by_type_map: d(_code => {
    //     return Enum.findAll({
    //             attributes: ['id', 'description'],
    //             where: { type: _code }
    //         })
    //         .then(enums => {
    //             let enum_id_map = {}
    //             enums.forEach(enoom => {
    //                 enum_id_map[enoom.description] = enoom.id
    //             })
    //             return enum_id_map
    //         })

    // }, { promise: true }),

    by_type_desc: d((_code, _description) => Enum.findOne({
        attributes: ['id', 'description'],
        where: { description: _description, type: _code },
    }), { promise: true }),

    get: d(_id => Enum.findById(_id, { attributes: ['description'] }), { promise: true }),
};

Object.defineProperties(Controller.prototype, memoizeMethods(memoize_methods));

module.exports = new Controller(Enum);
