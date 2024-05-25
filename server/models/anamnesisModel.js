const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');
// const Disease = require('./diseaseModel');
const Patient = require('./patientModel');

const Anamnesis = db.define(
  'anamnesis',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // diseaseUuid: {
    //   allowNull: false,
    //   type: DataTypes.UUID,
    //   references: {
    //     model: Disease,
    //     key: 'uuid',
    //   },
    // },
    patientUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: Patient,
        key: 'uuid',
      },
    },
    jsonAnamnesis: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    // note: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Anamnesis;
