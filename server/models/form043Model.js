const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const Form043 = db.define(
  'Form043',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // patientId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: 'Patient',
    //     key: 'uuid',
    //   },
    // },
    diagnosis: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complaints: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transferredAndAssociatedDiseases: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oclussion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // стан гігієни порожнини рота,стан слизової оболонки порожнини рота... (11 запис)
    medicalExaminationData: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    researchData: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vitaScale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    oralHealthTrainingData: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oralHygieneControlData: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Form043;
