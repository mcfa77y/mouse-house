'use strict';
module.exports = function(sequelize, DataTypes) {
  const Breed = sequelize.define('Breed', {
    id_alias: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    pairing_date: DataTypes.DATE,
    plug_date: DataTypes.DATE,
    pup_check_date: DataTypes.DATE,
    ween_date: DataTypes.DATE,
    male_count: DataTypes.INTEGER,
    female_count: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Breed.belongsTo(models.Enum, {as: 'status', foreignKey : 'status_id'})
        Breed.belongsTo(models.Mouse, {as: 'male_mouse', foreignKey : 'male_mouse_id'})
        Breed.belongsTo(models.Mouse, {as: 'female_mouse', foreignKey : 'female_mouse_id'})
        Breed.belongsTo(models.Note, {as: 'note', foreignKey : 'note_id'})
      }
    },
      underscored: true,
      timestamps: true,
      paranoid: true
  });
  return Breed;
};