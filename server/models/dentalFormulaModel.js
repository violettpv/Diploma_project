const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');
const Patient = require('./patientModel');

const DentalFormula = db.define(
  'dentalFormula',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    jsonDentalFormula: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    patientUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Patient,
        key: 'uuid',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = DentalFormula;
