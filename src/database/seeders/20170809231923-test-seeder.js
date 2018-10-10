'use strict';
const squel = require('squel')
module.exports = {
  up: function (queryInterface, Sequelize) {
    const query = squel.select()
        .from('public."Enums"')
        .field('id')
        .field('description')
        .field('type')
        .where("type = 'CAGE_TYPE'")
        .toString()

    return queryInterface.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT })
      .then(results =>{
        console.log(results)
      })
      .catch(error => { 
        console.log(error)
      })
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
