const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const TeethData = db.define(
  'TeethData',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = TeethData;
