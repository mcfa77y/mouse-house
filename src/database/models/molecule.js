
// import DEFAULT_OPTIONS from './default_options.json';
const DEFAULT_OPTIONS = require('./default_options.json');

const OPTIONS = { tableName: 'Molecules', ...DEFAULT_OPTIONS };
// module.exports = (sequelize, DataTypes) => {
export default (sequelize, DataTypes) => {
    const Molecule = sequelize.define('Molecule', {
        well_96: DataTypes.STRING,
        plate_id_384: DataTypes.STRING,
        plate_id_ucsc_csc: DataTypes.STRING,
        molecule_name: DataTypes.STRING,
        vial_code: DataTypes.STRING,
        cas_no: DataTypes.STRING,
        molecular_weight: DataTypes.DOUBLE,
        target: DataTypes.STRING,
        salt_data: DataTypes.STRING,
        info: DataTypes.TEXT,
        smiles: DataTypes.STRING,
    }, OPTIONS);
    Molecule.associate = (models) => {
        Molecule.Platemaps = Molecule.belongsToMany(models.Platemap,
            {
                as: 'platemaps',
                foreignKey: 'molecule_id',
                through: 'Platemap_Molecules',
                onDelete: 'CASCADE',
            });
    };
    return Molecule;
};
