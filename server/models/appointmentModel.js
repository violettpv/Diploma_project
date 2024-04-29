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
      references: {
        model: Patient,
        key: 'uuid',
      },
    },
    // таблиця User чи UserRole (= лікар)??
    userUuid: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'uuid',
      },
    },
    receiptUuid: {
      type: DataTypes.UUID,
      references: {
        model: Receipt,
        key: 'uuid',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    roomNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // для квитанції і переносу у звіт?
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
