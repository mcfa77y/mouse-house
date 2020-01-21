const DEFAULT_OPTIONS = require('./default_options.json');
const OPTIONS = Object.assign({ tableName: 'Projects' }, DEFAULT_OPTIONS);

export default (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
        name: DataTypes.STRING,
        note: DataTypes.TEXT,
    }, OPTIONS);
    Project.associate = (models) => {
        Project.Experiments = Project.belongsToMany(models.Experiment,
            { through: 'Project_Experiments' });
    };
    return Project;
};