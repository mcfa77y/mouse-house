module.exports = (sequelize, DataTypes) => {
    const Cage = sequelize.define('Cage', {
        id_alias: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
    }, {
        classMethods: {
            associate(models) {
                Cage.belongsTo(models.Enum, { as: 'type', foreignKey: 'type_id' });
                Cage.Note = Cage.belongsTo(models.Note, { as: 'note', foreignKey: 'note_id' });
                Cage.Mice = Cage.hasMany(models.Mouse, { as: 'mice', foreignKey: 'cage_id' });
            },
        },
        underscored: true,
        timestamps: true,
        paranoid: true,
    });
    return Cage;
};
