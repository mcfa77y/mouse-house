const DEFAULT_OPTIONS = require('./default_options.json');

const OPTIONS = Object.assign({tableName: 'Platemap_Molecules'}, DEFAULT_OPTIONS); 
export default (sequelize, DataTypes) => {
    const Platemap_Molecule = sequelize.define('Platemap_Molecules', {
        platemap_id: DataTypes.INTEGER,
        molecule_id: DataTypes.INTEGER,
    }, OPTIONS);
    Platemap_Molecule.associate = (models) => {
    };
    return Platemap_Molecule;
};
