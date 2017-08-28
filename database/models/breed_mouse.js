'use strict';
module.exports = function(sequelize, DataTypes) {
  var Breed_Mouse = sequelize.define('Breed_Mouse', {
    breed_id: DataTypes.INTEGER,
    mouse_id: DataTypes.INTEGER
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Breed_Mouse;
};