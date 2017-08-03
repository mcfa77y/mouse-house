'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Cages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_alias: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      setup_date: {
        type: Sequelize.DATE
      },
      update_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.TEXT
      },
      type_id: {
          type: Sequelize.INTEGER,
          references: {
              model: "Enums",
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
    return queryInterface.dropTable('Cages');
  }
};