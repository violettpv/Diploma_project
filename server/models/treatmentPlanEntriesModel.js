const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const TreatmentPlanEntries = db.define(
  'TreatmentPlanEntries',
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
    examinationPlan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    treatmentPlan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = TreatmentPlanEntries;
