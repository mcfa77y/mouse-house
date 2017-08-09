'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const tables = ['Breeds', 'Cages', 'Mice']
    const changes = tables.map(table =>{
      return queryInterface.changeColumn(
      table,
      'id_alias',
      {
        type: DataTypes.STRING,
        allowNull: false,
      }
    )
    })

    return Promise.all(changes)
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    const tables = ['Breeds', 'Cages', 'Mice']
    const changes = tables.map(table =>{
      return queryInterface.changeColumn(
      table,
      'id_alias',
      {
        type: Sequelize.STRING
      }
    )
    })

    return Promise.all(changes)
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
