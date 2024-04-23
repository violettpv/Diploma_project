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
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Patient',
        key: 'uuid',
      },
    },
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
    medicalExaminationData: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oclussion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    oralHygiene: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    researchData: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vitaScale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Form043;
