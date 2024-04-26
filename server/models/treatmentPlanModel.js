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
    // patientId: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: 'Patient',
    //     key: 'uuid',
    //   },
    // },
    // treatmentPlanEntriesId: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: 'TreatmentPlanEntries',
    //     key: 'uuid',
    // },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = TreatmentPlan;
