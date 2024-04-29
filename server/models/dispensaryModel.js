const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');
const Patient = require('./patientModel');
const User = require('./userModel');

const Dispensary = db.define(
  'dispensary',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    patientUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Patient,
        key: 'uuid',
      },
    },
    userUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'uuid',
      },
    },
    dateOfTheVisit: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    timeNeeded: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    treatment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Dispensary;
