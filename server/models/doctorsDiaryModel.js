const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const DoctorsDiary = db.define(
  'DoctorsDiary',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // patientId: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: 'Patient',
    //     key: 'uuid',
    //   },
    // },
    // diaryEntriesId: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: 'DoctorsDiaryEntries',
    //     key: 'uuid',
    //   },
    // },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = DoctorsDiary;
