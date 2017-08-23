'use strict';
module.exports = function(sequelize, DataTypes) {
  var Note = sequelize.define('Note', {
    text: DataTypes.TEXT
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
  return Note;
};