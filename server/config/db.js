const { Sequelize } = require('sequelize');

const db = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    operatorsAliases: 0,
    pool: {
      max: 100,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    timezone: '+03:00',
    dialectOptions: {},
  }
);

const syncTables = async () => {
  const User = require('../models/userModel');
  const Role = require('../models/roleModel');
  const UsersRoles = require('../models/usersRolesModel');
  const Clinic = require('../models/clinicModel');

  User.belongsToMany(Role, { through: UsersRoles });
  Role.belongsToMany(User, { through: UsersRoles });

  try {
    await db.sync();
    console.log('Tables synced');
  } catch (err) {
    console.error('Unable to sync tables:', err);
  }
};

module.exports = { db };
