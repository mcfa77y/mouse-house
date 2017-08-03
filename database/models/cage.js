'use strict';
module.exports = function(sequelize, DataTypes) {
  const Cage = sequelize.define('Cage', {
    id_alias: DataTypes.STRING,
    name: DataTypes.STRING,
    setup_date: DataTypes.DATE,
    update_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    notes: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Cage.belongsTo(models.Enum, { as:'type', foreignKey : 'type_id'})
      }
    },
      underscored: true,
      timestamps: true,
      paranoid: true
  });
  return Cage;
};