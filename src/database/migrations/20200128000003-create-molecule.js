
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Molecules', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: { type: Sequelize.STRING, }, 
    molarity_mm: { type: Sequelize.DOUBLE,},
    molarity_unit: { type: Sequelize.STRING,},
    cell: { type: Sequelize.STRING, },
    x: { type: Sequelize.INTEGER, },
    y: { type: Sequelize.INTEGER, },
    form: { type: Sequelize.STRING, }, 
    info: { type: Sequelize.TEXT, }, 
    max_solubility: { type: Sequelize.DOUBLE, }, 
    pathway: { type: Sequelize.STRING, }, 
    smiles: { type: Sequelize.STRING, }, 
    targets: { type: Sequelize.STRING, }, 
    weight: { type: Sequelize.DOUBLE, }, 
    platemap_id: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Platemaps',
        },
        key: 'id'
      },
      allowNull: false
    },
    product_info_id: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Product_Infos',
        },
        key: 'id'
      },
      allowNull: false
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Molecules'),
};
