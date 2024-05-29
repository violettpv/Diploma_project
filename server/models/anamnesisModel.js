const { DataTypes } = require('sequelize');
const { db } = require('../config/db');
const Patient = require('./patientModel');

const Anamnesis = db.define(
  'anamnesis',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    patientUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: Patient,
        key: 'uuid',
      },
    },
    jsonAnamnesis: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Anamnesis;
