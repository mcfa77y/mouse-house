
// import DEFAULT_OPTIONS from './default_options.json';
const DEFAULT_OPTIONS = require('./default_options.json');

const OPTIONS = { tableName: 'Molecules', ...DEFAULT_OPTIONS };
// module.exports = (sequelize, DataTypes) => {
export default (sequelize, DataTypes) => {

    const Molecule = sequelize.define('Molecule', {
        cell: DataTypes.STRING,
        form: DataTypes.STRING,
        info: DataTypes.TEXT,
        max_solubility: DataTypes.DOUBLE,
        molarity_mm: DataTypes.DOUBLE,
        molarity_unit: DataTypes.STRING,
        name: DataTypes.STRING,
        pathway: DataTypes.STRING,
        smiles: DataTypes.TEXT,
        targets: DataTypes.STRING,
        weight: DataTypes.DOUBLE,
        x: DataTypes.INTEGER,
        y: DataTypes.INTEGER,
    }, OPTIONS);

    Molecule.associate = (models) => {
        Molecule.Platemap = Molecule.belongsTo(models.Platemap,
            {
                as: 'platemap',
                foreignKey: 'platemap_id'
            });
        Molecule.Product_Info = Molecule.belongsTo(models.Product_Info,
            {
                as: 'product_info',
                foreignKey: 'product_info_id'
            });
    };

    return Molecule;
};
