'use strict';
module.exports = function(sequelize, DataTypes) {
  var Breed_Mouse = sequelize.define('Breed_Mouse', {
    breed_id: DataTypes.INTEGER,
    mouse_id: DataTypes.INTEGER
  }, {
    underscored: true
  });
  return Breed_Mouse;
};