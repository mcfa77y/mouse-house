'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    const add_male_id = queryInterface.addColumn('Breeds', 'male_id', 
    {
      type: Sequelize.INTEGER,
      references: {
            model: "Mice",
            key: "id"
        }
    })

    const add_female_id = queryInterface.addColumn('Breeds', 'female_id', 
    {
      type: Sequelize.INTEGER,
      references: {
            model: "Mice",
            key: "id"
        }
    })

    return Promise.all([add_male_id, add_female_id])
  },
  down: function(queryInterface, Sequelize) {
    const remove_male_id = queryInterface.removeColumn('Breeds', 'male_id');
    const remove_female_id = queryInterface.removeColumn('Breeds', 'female_id');

    return Promise.all([remove_male_id, remove_female_id]);
  }
};