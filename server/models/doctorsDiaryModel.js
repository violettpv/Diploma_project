const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');
const Patient = require('./patientModel');
const DoctorsDiaryRecord = require('./doctorsDiaryRecordModel');

const DoctorsDiary = db.define(
  'doctorsDiary',
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
    doctorsDiaryRecordUuid: {
      type: DataTypes.UUID,
      references: {
        model: DoctorsDiaryRecord,
        key: 'uuid',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = DoctorsDiary;
