const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const Dispensary = db.define(
  'Dispensary',
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'User',
        key: 'uuid',
      },
    },
    dateOfTheVisit: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    timeNeeded: {
      // maybe change time
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
