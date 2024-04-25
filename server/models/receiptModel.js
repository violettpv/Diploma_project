const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const Receipt = db.define(
  'Receipt',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // чи потрібна дата?
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sale: {
      type: DataTypes.DECIMAL(10, 2), // decimal
      allowNull: true,
    },
    // чи робити борг??
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    paymentTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'PaymentType',
        key: 'uuid',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Receipt;
