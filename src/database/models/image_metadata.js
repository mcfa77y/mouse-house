
// import DEFAULT_OPTIONS from './default_options.json';
const DEFAULT_OPTIONS = require('./default_options.json');

const OPTIONS = { tableName: 'Image_Metatdata', ...DEFAULT_OPTIONS };
// module.exports = (sequelize, DataTypes) => {
export default (sequelize, DataTypes) => {
    const Image_Metadata = sequelize.define('Image_Metadata', {
        size: DataTypes.STRING,
        wavelength: DataTypes.INTEGER,
        sector: DataTypes.INTEGER,
        uri: DataTypes.STRING,
    }, OPTIONS);

    Image_Metadata.associate = (models) => {
        Image_Metadata.Molecule = Image_Metadata.belongsTo(models.Molecule,
            {
                as: 'molecule',
                foreignKey: 'molecule_id',
                onDelete: 'CASCADE',
            });
        Image_Metadata.Experiment = Image_Metadata.belongsTo(models.Experiment,
            {
                as: 'experiment',
                foreignKey: 'experiment_id',
            });
    };

    return Image_Metadata;
};
