
// import DEFAULT_OPTIONS from './default_options.json';
const DEFAULT_OPTIONS = require('./default_options.json');

const OPTIONS = { tableName: 'Product_Infos', ...DEFAULT_OPTIONS };
// module.exports = (sequelize, DataTypes) => {
export default (sequelize, DataTypes) => {
    const Product_Info = sequelize.define('Product_Info', {
        barcode: DataTypes.STRING,
        cas_number: DataTypes.STRING,
        catalog_number: DataTypes.STRING,
        url: DataTypes.STRING,
    }, OPTIONS);
    Product_Info.associate = (models) => {
        Product_Info.Molecules = Product_Info.belongsToMany(models.Molecule,
            {
                as: 'molecules',
                foreignKey: 'product_info_id',
                through: 'Molecule_Product_Infos',
                onDelete: 'CASCADE',
            });

        // Product_Info.Platemaps = Product_Info.belongsToMany(models.Platemap,
        //     {
        //         as: 'platemaps',
        //         foreignKey: 'product_info_id',
        //         through: 'Platemap_Molecule_Product_Infos',
        //         onDelete: 'CASCADE',
        //     });
    };
    return Product_Info;
};
