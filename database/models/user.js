module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        familyName:{
            type: DataTypes.STRING,
        },
        givenName:{
            type: DataTypes.STRING,
        },
        photoUrl: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
    }, {
        underscored: true,
        timestamps: true,
        paranoid: true,
    });
    User.associate = (models) => {
        User.Mice = User.hasMany(models.Mouse, { as: 'mice', foreignKey: 'user_id' });
        User.Breeds = User.hasMany(models.Breed, { as: 'breeds', foreignKey: 'user_id' });
        User.Cages = User.hasMany(models.Cage, { as: 'cages', foreignKey: 'user_id' });
    }
    return User;
};
