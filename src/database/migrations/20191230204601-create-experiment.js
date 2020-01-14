
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Experiments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    note: {
      type: Sequelize.TEXT,
    },
    grid_data_uri: {
      type: Sequelize.STRING,
    },
    metadata_uri: {
      type: Sequelize.STRING,
    },
    image_config: {
      type: Sequelize.JSONB,
    },
    tag_config: {
      type: Sequelize.JSONB,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Experiments'),
};
