'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Breed_Mice', {
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
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Breed_Mice');
  }
};