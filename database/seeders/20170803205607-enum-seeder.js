'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
       

        return queryInterface.bulkInsert('Enums', [
                { description: 'breed_status_0', type: 'BREED_STATUS', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'breed_status_1', type: 'BREED_STATUS', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'male', type: 'SEX', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'female', type: 'SEX', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'mouse_status_0', type: 'MOUSE_STATUS', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'mouse_status_1', type: 'MOUSE_STATUS', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'Goldenticket', type: 'MOUSE_GENOTYPE', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'Rag2', type: 'MOUSE_GENOTYPE', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'B6', type: 'MOUSE_GENOTYPE', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'IRF 3/7 -/- dKO', type: 'MOUSE_GENOTYPE', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'stock', type: 'CAGE_TYPE', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'breeder', type: 'CAGE_TYPE', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'experimental', type: 'CAGE_TYPE', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' },
                { description: 'terminated', type: 'CAGE_TYPE', created_at: '2016-03-31T08:00:10.354Z', updated_at: '2016-03-31T08:00:10.354Z' }
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