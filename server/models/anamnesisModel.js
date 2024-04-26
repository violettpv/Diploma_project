const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');
// const Disease = require('./diseaseModel');
// const Patient = require('./patientModel');

const Anamnesis = db.define(
  'Anamnesis',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // diseaseUuid: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Disease,
    //     key: 'uuid',
    //   },
    // },
    // patientUuid: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: Patient,
    //     key: 'uuid',
    //   },
    // },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Anamnesis;
