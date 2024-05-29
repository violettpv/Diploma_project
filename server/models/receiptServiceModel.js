const { DataTypes } = require('sequelize');
const { db } = require('../config/db');
const Service = require('./serviceModel');
const Receipt = require('./receiptModel');

const ReceiptService = db.define(
  'receiptService',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    receiptUuid: {
      type: DataTypes.UUID,
      references: {
        model: Receipt,
        key: 'uuid',
      },
    },
    serviceUuid: {
      type: DataTypes.UUID,
      references: {
        model: Service,
        key: 'uuid',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ReceiptService;
