'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Mice', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_alias: {
        type: Sequelize.STRING
      },
      ear_tag: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.TEXT
      },
      sex_id: {
          type: Sequelize.INTEGER,
          references: {
              model: "Enums",
              key: "id"
          }
      },
      genotype_id: {
          type: Sequelize.INTEGER,
          references: {
              model: "Enums",
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
      cage_id: {
          type: Sequelize.INTEGER,
          references: {
              model: "Cages",
              key: "id"
          }
      },
      breed_id: {
          type: Sequelize.INTEGER,
          references: {
              model: "Breeds",
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
    return queryInterface.dropTable('Mice');
  }
};