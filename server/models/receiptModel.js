const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const Receipt = db.define(
  'receipt',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    sale: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // from client
    paymentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    // timestamps: true,
    timestamps: false,
  }
);

module.exports = Receipt;
