'use strict';
module.exports = function(sequelize, DataTypes) {
    const Enum = sequelize.define('Enum', {
        description: { type: DataTypes.STRING, unique: 'compositeIndex' },
        type: { type: DataTypes.STRING, unique: 'compositeIndex' }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        },
        underscored: true,
        timestamps: true,
        paranoid: true
    });
    return Enum;
};