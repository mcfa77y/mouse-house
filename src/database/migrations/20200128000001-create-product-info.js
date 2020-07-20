
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Product_Infos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    barcode: { type: Sequelize .STRING, }, 
    cas_number: { type: Sequelize.STRING, }, 
    catalog_number: { type: Sequelize.STRING, }, 
    url: { type: Sequelize.STRING, }, 
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Product_Infos'),
};
