'use strict';
module.exports = function(sequelize, DataTypes) {
  const Breed = sequelize.define('Breed', {
    id_alias: {
        type: DataTypes.STRING,
        allowNull: true,
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
        Breed.Mice = Breed.belongsToMany(models.Mouse, {through: 'Breed_Mouse'})
        Breed.Note = Breed.belongsTo(models.Note, {as: 'note', foreignKey : 'note_id'})
        Breed.belongsTo(models.Enum, {as: 'status', foreignKey : 'status_id'})
        Breed.belongsTo(models.Enum, {as: 'genotype', foreignKey : 'genotype_id'})
      }
    },
      underscored: true,
      timestamps: true,
      paranoid: true
  });
  return Breed;
};