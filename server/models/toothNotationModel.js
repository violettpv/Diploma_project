const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const ToothNotation = db.define(
  'ToothNotation',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    notation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ToothNotation;
