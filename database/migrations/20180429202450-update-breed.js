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

    const drop_breed_mice_table = queryInterface.dropTable('Breed_Mice')
    return Promise.all([add_male_id, add_female_id, drop_breed_mice_table])
  },
  down: function(queryInterface, Sequelize) {
    const remove_male_id = queryInterface.removeColumn('Breeds', 'male_id');
    const remove_female_id = queryInterface.removeColumn('Breeds', 'female_id');
    const create_breed_mice = queryInterface.createTable('Breed_Mice', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      breed_id: {
        type: Sequelize.INTEGER,
        references: {
              model: "Breeds",
              key: "id"
          }
      },
      mouse_id: {
        type: Sequelize.INTEGER,
        references: {
              model: "Mice",
              key: "id"
          }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    return Promise.all([remove_male_id, remove_female_id, create_breed_mice]);
  }
};