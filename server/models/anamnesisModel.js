const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const Anamnesis = db.define(
  'Anamnesis',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    disease: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Disease',
        key: 'uuid',
      },
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Patient',
        key: 'uuid',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Anamnesis;
