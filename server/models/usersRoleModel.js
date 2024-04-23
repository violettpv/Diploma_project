const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');

const UsersRole = db.define(
  'UsersRoles',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'User',
        key: 'uuid',
      },
    },
    userRole: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Role',
        key: 'uuid',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = UsersRole;
