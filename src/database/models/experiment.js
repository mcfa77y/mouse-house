
// import DEFAULT_OPTIONS from './default_options.json';
const DEFAULT_OPTIONS = require('./default_options.json');

const OPTIONS = { tableName: 'Experiments', ...DEFAULT_OPTIONS };
// module.exports = (sequelize, DataTypes) => {
export default (sequelize, DataTypes) => {
    const Experiment = sequelize.define('Experiment', {
        image_name: DataTypes.STRING,
        measurement_name: DataTypes.STRING,
        platemap_name: DataTypes.STRING,
        dapi_w1: DataTypes.INTEGER,
        actin_w3: DataTypes.INTEGER,
        lectin_w2: DataTypes.INTEGER,
        tubulin_w2: DataTypes.INTEGER,
        ph3_w3: DataTypes.INTEGER,
        ph3_w4: DataTypes.INTEGER,
        edu_w2: DataTypes.INTEGER,
        calnexin_w4: DataTypes.INTEGER,
        gm130w4: DataTypes.INTEGER,
        controlplate: DataTypes.INTEGER,
        cell_lines: DataTypes.STRING,
        timepoint: DataTypes.STRING,
        magnification: DataTypes.STRING,
        cp_version: DataTypes.INTEGER,
        human_readable_name: DataTypes.STRING,
        experiment_date: DataTypes.STRING,
        ixmw1: DataTypes.STRING,
        ixmw2: DataTypes.STRING,
        ixmw3: DataTypes.STRING,
        ixmw4: DataTypes.STRING,
    }, OPTIONS);
    Experiment.associate = (models) => {
        Experiment.Platemap = Experiment.belongsTo(models.Platemap,
            {
                as: 'platemap',
                foreignKey: 'platemap_id',
            });
    };
    return Experiment;
};
