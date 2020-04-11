const DEFAULT_OPTIONS = require('./default_options.json');

const OPTIONS = Object.assign({tableName: 'Project_Experiments'}, DEFAULT_OPTIONS); 
export default (sequelize, DataTypes) => {
    const Project_Experiment = sequelize.define('Project_Experiments', {
        project_id: DataTypes.INTEGER,
        experiment_id: DataTypes.INTEGER,
    }, OPTIONS);
    Project_Experiment.associate = (models) => {
    };
    return Project_Experiment;
};
