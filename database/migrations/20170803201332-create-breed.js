'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Breeds', {
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
      pairing_date: {
        type: Sequelize.DATE
      },
      plug_date: {
        type: Sequelize.DATE
      },
      pup_check_date: {
        type: Sequelize.DATE
      },
      ween_date: {
        type: Sequelize.DATE
      },
      male_count: {
        type: Sequelize.INTEGER
      },
      female_count: {
        type: Sequelize.INTEGER
      },
      note_id: {
        type: Sequelize.INTEGER,
          references: {
              model: "Notes",
              key: "id"
          }
      },
      status_id: {
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Breeds');
  }
};