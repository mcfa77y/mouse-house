'use strict';
module.exports = function(sequelize, DataTypes) {
  const Cage = sequelize.define('Cage', {
    id_alias: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    name: DataTypes.STRING,
    setup_date: DataTypes.DATE,
    update_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Cage.belongsTo(models.Enum, { as:'type', foreignKey : 'type_id'})
        Cage.Note = Cage.belongsTo(models.Note, {as: 'note', foreignKey : 'note_id'})
        Cage.Mice = Cage.hasMany(models.Mouse, {as: 'mice', foreignKey: 'cage_id'})
      }
    },
      underscored: true,
      timestamps: true,
      paranoid: true
  });
  return Cage;
};