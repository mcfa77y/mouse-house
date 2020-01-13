
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Project_Experiments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    project_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Projects',
        key: 'id',
      },
    },
    experiment_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Experiments',
        key: 'id',
      },
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Project_Experiments'),
};
