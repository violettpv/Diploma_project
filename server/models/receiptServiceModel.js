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
    // receiptId: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: 'Receipt',
    //     key: 'uuid',
    //   },
    // },
    // serviceId: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: 'Service',
    //     key: 'uuid',
    //   },
    // },
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
