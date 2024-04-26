const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const DoctorsDiaryEntries = db.define(
  'DoctorsDiaryEntries',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    complaints: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anamnesis: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    diagnosis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    treatment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recommendations: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = DoctorsDiaryEntries;
