const { DataTypes } = require('sequelize');
const { db } = require('../config/db');
const TreatmentPlanRecord = require('./treatmentPlanRecordModel');
const Patient = require('./patientModel');

const TreatmentPlan = db.define(
  'treatmentPlan',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    patientUuid: {
      type: DataTypes.UUID,
      references: {
        model: Patient,
        key: 'uuid',
      },
    },
    treatmentPlanRecordUuid: {
      type: DataTypes.UUID,
      references: {
        model: TreatmentPlanRecord,
        key: 'uuid',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = TreatmentPlan;
