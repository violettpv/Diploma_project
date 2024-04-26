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
    jsonDentalFormula: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // patientId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: 'Patient',
    //     key: 'uuid',
    //   },
    // },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = DentalFormula;
