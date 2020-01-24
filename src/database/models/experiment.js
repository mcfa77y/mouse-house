
// import DEFAULT_OPTIONS from './default_options.json';
const DEFAULT_OPTIONS = require('./default_options.json');

const OPTIONS = { tableName: 'Experiments', ...DEFAULT_OPTIONS };
// module.exports = (sequelize, DataTypes) => {
export default (sequelize, DataTypes) => {
    const Experiment = sequelize.define('Experiment', {
        name: DataTypes.STRING,
        note: DataTypes.TEXT,
        grid_data_uri: DataTypes.STRING,
        metadata_uri: DataTypes.STRING,
        image_config: DataTypes.JSONB,
        tag_config: DataTypes.JSONB,
    }, OPTIONS);
    Experiment.associate = (models) => {
        Experiment.Projects = Experiment.belongsToMany(models.Project,
            {
                as: "projects",
                foreignKey: 'experiment_id',
                through: 'Project_Experiments',
                onDelete: 'CASCADE',
            });
    };
    return Experiment;
};
