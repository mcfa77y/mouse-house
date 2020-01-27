
// import DEFAULT_OPTIONS from './default_options.json';
const DEFAULT_OPTIONS = require('./default_options.json');

const OPTIONS = { tableName: 'Platemaps', ...DEFAULT_OPTIONS };
// module.exports = (sequelize, DataTypes) => {
export default (sequelize, DataTypes) => {
    const Platemap = sequelize.define('Platemap', {
        plate_id_96: DataTypes.STRING,
        plate_number_96: DataTypes.STRING,
        well_384: DataTypes.STRING,
        molarity_mm: DataTypes.DOUBLE,
        molarity_unit: DataTypes.STRING,
        well_x: DataTypes.INTEGER,
        well_y: DataTypes.INTEGER,
    }, OPTIONS);
    Platemap.associate = (models) => {
        Platemap.Molecules = Platemap.belongsToMany(models.Molecule,
            {
                as: 'molecules',
                foreignKey: 'platemap_id',
                through: 'Platemap_Molecules',
                onDelete: 'CASCADE',
            });
    };
    return Platemap;
};
