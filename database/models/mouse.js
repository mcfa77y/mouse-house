'use strict';
module.exports = function(sequelize, DataTypes) {
  const Mouse = sequelize.define('Mouse', {
    id_alias: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    ear_tag: DataTypes.STRING,
    dob: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Mouse.belongsTo(models.Cage)
        Mouse.belongsTo(models.Breed)

        Mouse.belongsTo(models.Enum, {as: 'sex', foreignKey : 'sex_id'})
        Mouse.belongsTo(models.Enum, {as: 'genotype', foreignKey : 'genotype_id'})
        Mouse.belongsTo(models.Enum, {as: 'status', foreignKey : 'status_id'})

        Mouse.belongsTo(models.Note, {as: 'note', foreignKey : 'note_id'})
      }
    },
      underscored: true,
      timestamps: true,
      paranoid: true
  });
  return Mouse;
};