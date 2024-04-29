const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const Disease = db.define(
  'disease',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Disease;
