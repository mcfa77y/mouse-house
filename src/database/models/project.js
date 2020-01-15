console.log('Model init Project');

const DEFAULT_OPTIONS = require('./default_options.json');

DEFAULT_OPTIONS.tableName = 'Projects';
export default (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
        name: DataTypes.STRING,
        note: DataTypes.TEXT,
    }, DEFAULT_OPTIONS);
    Project.associate = (models) => {
        Project.Experiments = Project.belongsToMany(models.Experiment,
            { through: 'Project_Experiments' });
    };
    return Project;
};
console.log('Finished Model init Project');