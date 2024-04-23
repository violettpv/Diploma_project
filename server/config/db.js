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
  const Anamnesis = require('../models/anamnesisModel');
  const Clinic = require('../models/clinicModel');
  const DentalFormula = require('../models/dentalFormulaModel');
  const Disease = require('../models/diseaseModel');
  const Dispensary = require('../models/dispensaryModel');
  const Form043 = require('../models/form043Model');
  const Note = require('../models/noteModel');
  const Patient = require('../models/patientModel');
  const Role = require('../models/roleModel');
  const Service = require('../models/serviceModel');
  const TreatmentPlan = require('../models/treatmentPlanModel');
  const User = require('../models/userModel');
  const UsersRole = require('../models/usersRoleModel');

  User.belongsToMany(Role, { through: UsersRole });
  Role.belongsToMany(User, { through: UsersRole });
  Patient.belongsToMany(Disease, { through: Anamnesis });
  Disease.belongsToMany(Patient, { through: Anamnesis });

  try {
    await db.sync();
    console.log('Tables synced');
  } catch (err) {
    console.error('Unable to sync tables:', err);
  }
};

module.exports = { db };
