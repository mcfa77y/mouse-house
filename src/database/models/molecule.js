
// import DEFAULT_OPTIONS from './default_options.json';
const DEFAULT_OPTIONS = require('./default_options.json');

const OPTIONS = { tableName: 'Molecules', ...DEFAULT_OPTIONS };
// module.exports = (sequelize, DataTypes) => {
export default (sequelize, DataTypes) => {

    const Molecule = sequelize.define('Molecule', {
        form: DataTypes.STRING,
        info: DataTypes.TEXT,
        max_solubility: DataTypes.DOUBLE,
        name: DataTypes.STRING,
        pathway: DataTypes.STRING,
        smiles: DataTypes.STRING,
        targets: DataTypes.STRING,
        weight: DataTypes.DOUBLE,
    }, OPTIONS);

    Molecule.associate = (models) => {
        Molecule.Platemap = Molecule.hasOne(models.Platemap,
            {
                as: 'platemap',
                foreignKey: 'molecule_id'
            });
        Molecule.Product_Info = Molecule.hasOne(models.Product_Info,
            {
                as: 'well',
                foreignKey: 'molecule_id'
            });
    };

    return Molecule;
};
