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
  // const Appointment = require('../models/appointmentModel');

  // const DentalFormula = require('../models/dentalFormulaModel');
  const Disease = require('../models/diseaseModel');
  // const Dispensary = require('../models/dispensaryModel');
  // const DoctorsDiaryEntries = require('../models/doctorsDiaryEntriesModel');
  // const DoctorsDiary = require('../models/doctorsDiaryModel');
  // const Form043 = require('../models/form043Model');
  // const Note = require('../models/noteModel');
  const Patient = require('../models/patientModel');
  // const PaymentType = require('../models/paymentTypeModel');
  // const Receipt = require('../models/receiptModel');
  // const ReceiptService = require('../models/receiptServiceModel');

  // const Service = require('../models/serviceModel');
  // const Tooth = require('../models/toothModel');
  // const ToothNotation = require('../models/toothNotationModel');
  // const TreatmentPlan = require('../models/treatmentPlanModel');

  const User = require('../models/userModel');
  const Role = require('../models/roleModel');
  const UsersRole = require('../models/usersRoleModel');
  const Clinic = require('../models/clinicModel');

  // M:M
  User.belongsToMany(Role, { through: UsersRole, foreignKey: 'userUuid' });
  Role.belongsToMany(User, { through: UsersRole, foreignKey: 'roleUuid' });

  // 1:M
  Clinic.hasMany(User);
  User.belongsTo(Clinic, { foreignKey: 'clinicUuid' });

  Patient.belongsToMany(Disease, { through: Anamnesis, foreignKey: 'patientUuid' });
  Disease.belongsToMany(Patient, { through: Anamnesis, foreignKey: 'diseaseUuid' });

  try {
    await db.sync();
    console.log('Tables synced');
  } catch (err) {
    console.error('Unable to sync tables:', err);
  }
};

module.exports = { db, syncTables };
