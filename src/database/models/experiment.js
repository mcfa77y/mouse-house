
// import DEFAULT_OPTIONS from './default_options.json';
const DEFAULT_OPTIONS = require('./default_options.json');

DEFAULT_OPTIONS.tableName = 'Experiments';
module.exports = (sequelize, DataTypes) => {
    const Experiment = sequelize.define('Experiment', {
        name: DataTypes.STRING,
        note: DataTypes.TEXT,
        grid_data_uri: DataTypes.STRING,
        metadata_uri: DataTypes.STRING,
        image_config: DataTypes.JSONB,
        tag_config: DataTypes.JSONB,
    }, DEFAULT_OPTIONS);
    Experiment.associate = (models) => {
        Experiment.Projects = Experiment.belongsToMany(models.Project,
            { through: 'Project_Experiments' });
    };
    return Experiment;
};
