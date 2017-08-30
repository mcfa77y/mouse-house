'use strict';
module.exports = function(sequelize, DataTypes) {
  const Enum = sequelize.define('Enum', {
    description: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
      underscored: true,
      timestamps: true,
      paranoid: true
  });
  return Enum;
};