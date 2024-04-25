const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const PaymentType = db.define(
  'PaymentType',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = PaymentType;
