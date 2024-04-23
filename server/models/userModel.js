const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const User = db.define(
  'User',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patronymic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^\+(380)[0-9]{9}$/,
      },
    },
    isMainAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    clinicId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Clinic',
        key: 'uuid',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = User;
