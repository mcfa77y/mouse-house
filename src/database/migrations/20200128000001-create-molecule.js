
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Molecules', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    well_96: { type: Sequelize.STRING, allowNull: false },
    plate_id_384: { type: Sequelize.STRING, allowNull: false },
    plate_id_ucsc_csc: { type: Sequelize.STRING, allowNull: false },
    molecule_name: { type: Sequelize.STRING, allowNull: false },
    vial_code: { type: Sequelize.STRING, allowNull: false },
    cas_no: { type: Sequelize.STRING, allowNull: false },
    molecular_weight: { type: Sequelize.DOUBLE, allowNull: false },
    target: { type: Sequelize.STRING, allowNull: false },
    salt_data: { type: Sequelize.STRING, allowNull: false },
    info: { type: Sequelize.TEXT, allowNull: false },
    smiles: { type: Sequelize.STRING, allowNull: false },
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
