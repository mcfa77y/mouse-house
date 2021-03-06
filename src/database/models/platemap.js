
// import DEFAULT_OPTIONS from './default_options.json';
const DEFAULT_OPTIONS = require('./default_options.json');

const OPTIONS = { tableName: 'Platemaps', ...DEFAULT_OPTIONS };
// module.exports = (sequelize, DataTypes) => {
export default (sequelize, DataTypes) => {
    const Platemap = sequelize.define('Platemap', {
        name: DataTypes.STRING,
        id_384: DataTypes.STRING,
        id_ucsc_csc: DataTypes.STRING,
        library: DataTypes.STRING,
        tags: DataTypes.JSONB,
    }, OPTIONS);

    Platemap.associate = (models) => {
        Platemap.Molecules = Platemap.hasMany(models.Molecule,
            {
                as: 'molecules',
                foreignKey: 'platemap_id',
                onDelete: 'CASCADE',
            });
        Platemap.Experiments = Platemap.hasMany(models.Experiment,
            {
                as: 'experiments',
                foreignKey: 'platemap_id',
            });
    };

    return Platemap;
};
