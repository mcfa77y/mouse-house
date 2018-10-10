'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
       let date = '2016-03-31T08:00:10.354Z'

        return queryInterface.bulkInsert('Enums', [
                { description: 'breed_status_0', type: 'BREED_STATUS', created_at: date, updated_at: date },
                { description: 'breed_status_1', type: 'BREED_STATUS', created_at: date, updated_at: date },
                { description: 'male', type: 'SEX', created_at: date, updated_at: date },
                { description: 'female', type: 'SEX', created_at: date, updated_at: date },
                { description: 'unknown', type: 'SEX', created_at: date, updated_at: date },
                { description: 'breeder', type: 'MOUSE_STATUS', created_at: date, updated_at: date },
                { description: 'experimental', type: 'MOUSE_STATUS', created_at: date, updated_at: date },
                { description: 'stock', type: 'MOUSE_STATUS', created_at: date, updated_at: date },
                { description: 'terminated', type: 'MOUSE_STATUS', created_at: date, updated_at: date },
                { description: 'unkown', type: 'MOUSE_STATUS', created_at: date, updated_at: date },
                { description: 'Goldenticket', type: 'MOUSE_GENOTYPE', created_at: date, updated_at: date },
                { description: 'Rag2', type: 'MOUSE_GENOTYPE', created_at: date, updated_at: date },
                { description: 'B6', type: 'MOUSE_GENOTYPE', created_at: date, updated_at: date },
                { description: 'IRF 3/7 -/- dKO', type: 'MOUSE_GENOTYPE', created_at: date, updated_at: date },
                { description: 'breeder', type: 'CAGE_TYPE', created_at: date, updated_at: date },
                { description: 'experimental', type: 'CAGE_TYPE', created_at: date, updated_at: date },
                { description: 'stock', type: 'CAGE_TYPE', created_at: date, updated_at: date },
                { description: 'terminated', type: 'CAGE_TYPE', created_at: date, updated_at: date },
                { description: 'unknown', type: 'CAGE_TYPE', created_at: date, updated_at: date },
            ], {})
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

    down: function(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Enums', null, {});
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('Person', null, {});
        */
    }
};