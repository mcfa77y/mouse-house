module.exports = (sequelize, DataTypes) => {
    const Cage = sequelize.define('Cage', {
        id_alias: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        end_date: DataTypes.DATE,
    }, {
        underscored: true,
        timestamps: true,
        paranoid: true,
    });
    Cage.associate = (models) => {
        Cage.Type = Cage.belongsTo(models.Enum, { as: 'type', foreignKey: 'type_id' });
        Cage.Note = Cage.belongsTo(models.Note, { as: 'note', foreignKey: 'note_id' });
        Cage.Mice = Cage.hasMany(models.Mouse, { as: 'mice', foreignKey: 'cage_id' });
        Cage.User = Cage.belongsTo(models.User);
    }
    return Cage;
};
