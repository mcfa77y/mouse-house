'use strict';
module.exports = function(sequelize, DataTypes) {
  var Note = sequelize.define('Note', {
    text: DataTypes.TEXT
  }, {
    underscored: true,
    timestamps: true,
    paranoid: true
  });
  
  return Note;
};