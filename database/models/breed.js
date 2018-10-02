module.exports = (sequelize, DataTypes) => {
    const Breed = sequelize.define('Breed', {
        id_alias: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        pairing_date: DataTypes.DATE,
        plug_date: DataTypes.DATE,
        pup_check_date: DataTypes.DATE,
        litter_date: DataTypes.DATE,
        ween_date: DataTypes.DATE,
        male_count: { type: DataTypes.INTEGER, defaultValue: 0 },
        female_count: { type: DataTypes.INTEGER, defaultValue: 0 },
        unknown_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    }, {
        underscored: true,
        timestamps: true,
        paranoid: true,
    });
    Breed.associate = (models) => {
        Breed.Male = Breed.belongsTo(models.Mouse, { as: 'male', foreignKey: 'male_id' });
        Breed.Female = Breed.belongsTo(models.Mouse, { as: 'female', foreignKey: 'female_id' });
        Breed.Note = Breed.belongsTo(models.Note, { as: 'note', foreignKey: 'note_id' });
        Breed.belongsTo(models.Enum, { as: 'status', foreignKey: 'status_id' });
        Breed.belongsTo(models.Enum, { as: 'genotype', foreignKey: 'genotype_id' });
        Breed.User = Breed.belongsTo(models.User);
    }
    return Breed;
};
