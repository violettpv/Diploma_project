const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const TreatmentPlan = db.define(
  'TreatmentPlan',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Patient',
        key: 'uuid',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    treatment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = TreatmentPlan;
