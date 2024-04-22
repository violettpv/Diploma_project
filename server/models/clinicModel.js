const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const Clinic = db.define(
  'Clinic',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^\+(380)[0-9]{9}$/,
      },
    },
    phone2: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^\+(380)[0-9]{9}$/,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = { Clinic };
