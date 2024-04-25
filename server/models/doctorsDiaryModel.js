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
    diaryEntriesId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'DoctorsDiaryEntries',
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
