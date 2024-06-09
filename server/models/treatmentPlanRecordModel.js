const { DataTypes } = require('sequelize');
const { db } = require('../config/db');

const TreatmentPlanRecord = db.define(
  'treatmentPlanRecord',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    examination: {
      // type: DataTypes.STRING,
      type: DataTypes.TEXT,
      allowNull: false,
    },
    treatment: {
      // type: DataTypes.STRING,
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = TreatmentPlanRecord;
