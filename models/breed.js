'use strict';
module.exports = function(sequelize, DataTypes) {
  const Breed = sequelize.define('Breed', {
    id_alias: DataTypes.STRING,
    pairing_date: DataTypes.DATE,
    plug_date: DataTypes.DATE,
    pup_check_date: DataTypes.DATE,
    ween_date: DataTypes.DATE,
    male_count: DataTypes.INTEGER,
    female_count: DataTypes.INTEGER,
    notes: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Breedl.belongsTo(models.Enum, {as: 'status', foreignKey : 'status_id'})
      }
    },
      underscored: true,
      timestamps: true,
      paranoid: true
  });
  return Breed;
};