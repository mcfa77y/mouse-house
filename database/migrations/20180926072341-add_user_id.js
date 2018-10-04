'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const add_user_id_breed = queryInterface.addColumn('Breeds', 'user_id', {type: Sequelize.INTEGER});
    const add_user_id_cage = queryInterface.addColumn('Cages', 'user_id', {type: Sequelize.INTEGER});
    const add_user_id_mouse = queryInterface.addColumn('Mice', 'user_id', {type: Sequelize.INTEGER});
    
    return Promise.all([add_user_id_breed, add_user_id_cage, add_user_id_mouse]);
  },
  down:  (queryInterface, Sequelize) => {
    const rm_user_id_breed = queryInterface.removeColumn('Breeds', 'user_id');
    const rm_user_id_cage = queryInterface.removeColumn('Cages', 'user_id');
    const rm_user_id_mouse = queryInterface.removeColumn('Mice', 'user_id');
    return Promise.all([rm_user_id_breed, rm_user_id_cage, rm_user_id_mouse])
      .catch(err => console.error(err));
  },

};