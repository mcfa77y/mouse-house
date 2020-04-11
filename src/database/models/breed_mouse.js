
module.exports = (sequelize, DataTypes) => {
    const Breed_Mouse = sequelize.define('Breed_Mouse', {
        breed_id: DataTypes.INTEGER,
        mouse_id: DataTypes.INTEGER,
    }, {
        underscored: true,
        classMethods: {
            associate(models) {
                // associations can be defined here
            },
        },
    });
    return Breed_Mouse;
};
