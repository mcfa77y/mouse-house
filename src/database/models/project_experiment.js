const DEFAULT_OPTIONS = require('./default_options.json');

DEFAULT_OPTIONS.tableName = 'Project_Experiments';
export default (sequelize, DataTypes) => {
    const Project_Experiment = sequelize.define('Project_Experiments', {
        project_id: DataTypes.INTEGER,
        experiment_id: DataTypes.INTEGER,
    }, DEFAULT_OPTIONS);
    Project_Experiment.associate = (models) => {
    };
    return Project_Experiment;
};
