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
      unique: false,
      allowNull: false,
      references: {
        model: Patient,
        key: 'uuid',
      },
    },
    userUuid: {
      type: DataTypes.UUID,
      unique: false,
      allowNull: false,
      references: {
        model: User,
        key: 'uuid',
      },
    },
    dateOfTheVisit: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: false,
      validate: {
        is: /(20[0-9]{2})-([0-1][0-9])-([0-3][0-9])/,
      },
    },
    timeNeeded: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // is: /[0-9]{2}:[0-9]{2}/,
        is: /^\d{1,2}:\d{2}$/,
      },
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
