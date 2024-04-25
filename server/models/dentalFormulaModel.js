const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const DentalFormula = db.define(
  'DentalFormula',
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
    toothId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Tooth',
        key: 'uuid',
      },
    },
    notationId: {
      type: DataTypes.UUID,
      // може бути без запису?
      allowNull: true,
      references: {
        model: 'ToothNotation',
        key: 'uuid',
      },
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = DentalFormula;
