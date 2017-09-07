'use strict';
module.exports = function(sequelize, DataTypes) {
    const Mouse = sequelize.define('Mouse', {
        id_alias: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        ear_tag: DataTypes.STRING,
        dob: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {
                Mouse.Cage = Mouse.belongsTo(models.Cage)
                Mouse.Breeds = Mouse.belongsToMany(models.Breed, { through: 'Breed_Mouse' })

                Mouse.Sex = Mouse.belongsTo(models.Enum, {
                    as: 'sex',
                    foreignKey: 'sex_id',
                    scope: {
                        type: 'SEX'
                    }
                })
                Mouse.Genotype = Mouse.belongsTo(models.Enum, {
                    as: 'genotype',
                    foreignKey: 'genotype_id',
                    scope: {
                        type: 'MOUSE_GENOTYPE'
                    }
                })
                Mouse.Status = Mouse.belongsTo(models.Enum, {
                    as: 'status',
                    foreignKey: 'status_id',
                    scope: {
                        type: 'MOUSE_STATUS'
                    }
                })

                Mouse.Note = Mouse.belongsTo(models.Note, {
                    as: 'note',
                    foreignKey: 'note_id'
                })
            }
        },
        underscored: true,
        timestamps: true,
        paranoid: true
    });
    return Mouse;
};