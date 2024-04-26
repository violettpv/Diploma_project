const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../config/db');
// const Role = require('./roleModel');
// const User = require('./userModel');

const UsersRole = db.define(
  'UsersRole',
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // userUuid: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: User,
    //     key: 'uuid',
    //   },
    // },
    // roleUuid: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: Role,
    //     key: 'uuid',
    //   },
    // },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = UsersRole;
