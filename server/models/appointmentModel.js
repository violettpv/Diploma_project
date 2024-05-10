const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');
const Patient = require('./patientModel');
const User = require('./userModel');
const Receipt = require('./receiptModel');

const Appointment = db.define(
  'appointment',
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
    receiptUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Receipt,
        key: 'uuid',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: false,
      validate: {
        is: /(20[0-9]{2})-([0-1][0-9])-([0-3][0-9])/,
      },
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        is: /[0-9]{2}:[0-9]{2}/,
      },
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        is: /[0-9]{2}:[0-9]{2}/,
      },
    },
    roomNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isFinished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

module.exports = Appointment;
