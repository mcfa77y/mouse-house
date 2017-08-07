'use strict';
module.exports = function(sequelize, DataTypes) {
  var Enum2 = sequelize.define('Enum2', {
    description: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Enum2;
};