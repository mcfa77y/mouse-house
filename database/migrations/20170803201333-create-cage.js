'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Cages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_alias: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      end_date: {
        type: Sequelize.DATE
      },
      note_id: {
        type: Sequelize.INTEGER,
          references: {
              model: "Notes",
              key: "id"
          }
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
      },
      deleted_at: {
         type: Sequelize.DATE
       }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Cages');
  }
};