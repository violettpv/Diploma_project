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
    // don't sure if I need patientId here
    // patientId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: 'Patient',
    //     key: 'uuid',
    //   },
    // },
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
