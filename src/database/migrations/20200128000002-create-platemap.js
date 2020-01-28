
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Platemaps', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    plate_id_96: { type: Sequelize.STRING, allowNull: false },
    plate_number_96: { type: Sequelize.STRING, allowNull: false },
    well_384: { type: Sequelize.STRING, allowNull: false },
    molarity_mm: { type: Sequelize.DOUBLE, allowNull: false },
    molarity_unit: { type: Sequelize.STRING, allowNull: false },
    well_x: { type: Sequelize.INTEGER, allowNull: false },
    well_y: { type: Sequelize.INTEGER, allowNull: false },
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
