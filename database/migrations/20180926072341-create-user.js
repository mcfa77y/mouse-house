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
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      familyName:{
          type: DataTypes.STRING,
      },
      givenName:{
          type: DataTypes.STRING,
      },
      photoUrl: {
          type: DataTypes.STRING,
      },
      password: {
          type: DataTypes.STRING,
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
    return queryInterface.dropTable('Users');
  }
};
