const DEFAULT_OPTIONS = require('./default_options.json');

DEFAULT_OPTIONS.tableName = 'Projects';
module.exports = (sequelize, DataTypes) => {
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
