const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const ReceiptService = db.define(
  'ReceiptService',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    receiptId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Receipt',
        key: 'uuid',
      },
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Service',
        key: 'uuid',
      },
    },
    // чи правильно??
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ReceiptService;
