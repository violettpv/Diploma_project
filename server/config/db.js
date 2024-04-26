const { Sequelize, DataTypes } = require('sequelize');

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
  const Clinic = require('../models/clinicModel');
  const User = require('../models/userModel');
  const Role = require('../models/roleModel');
  const UsersRole = require('../models/usersRoleModel');
  const Patient = require('../models/patientModel');
  const Disease = require('../models/diseaseModel');
  const Anamnesis = require('../models/anamnesisModel');
  const Note = require('../models/noteModel');
  const Service = require('../models/serviceModel');
  const Receipt = require('../models/receiptModel');
  const ReceiptService = require('../models/receiptServiceModel');
  const Appointment = require('../models/appointmentModel');
  const Dispensary = require('../models/dispensaryModel');
  const Form043 = require('../models/form043Model');
  const TreatmentPlanEntries = require('../models/treatmentPlanEntriesModel');
  const TreatmentPlan = require('../models/treatmentPlanModel');
  const DoctorsDiaryEntries = require('../models/doctorsDiaryEntriesModel');
  const DoctorsDiary = require('../models/doctorsDiaryModel');
  const DentalFormula = require('../models/dentalFormulaModel');

  // Assosiations / Relationships
  // M:M
  User.belongsToMany(Role, { through: UsersRole });
  Role.belongsToMany(User, { through: UsersRole });
  // 1:M
  Clinic.hasMany(User);
  User.belongsTo(Clinic);
  // M:M
  Patient.belongsToMany(Disease, { through: Anamnesis });
  Disease.belongsToMany(Patient, { through: Anamnesis });
  // 1:M
  Receipt.hasMany(ReceiptService);
  ReceiptService.belongsTo(Receipt);
  // 1:1
  Receipt.hasOne(Appointment);
  Appointment.belongsTo(Receipt);
  // 1:M (user = doctor)
  Patient.hasMany(Appointment);
  Appointment.belongsTo(Patient);
  User.hasMany(Appointment);
  Appointment.belongsTo(User);
  // 1:M
  Patient.hasMany(Dispensary);
  Dispensary.belongsTo(Patient);
  User.hasMany(Dispensary);
  Dispensary.belongsTo(User);
  // 1:1
  Patient.hasOne(Form043);
  Form043.belongsTo(Patient);
  Patient.hasOne(DentalFormula);
  DentalFormula.belongsTo(Patient);
  // M:M
  Patient.belongsToMany(TreatmentPlanEntries, { through: TreatmentPlan });
  TreatmentPlanEntries.belongsToMany(Patient, { through: TreatmentPlan });
  Patient.belongsToMany(DoctorsDiaryEntries, { through: DoctorsDiary });
  DoctorsDiaryEntries.belongsToMany(Patient, { through: DoctorsDiary });

  try {
    await db.sync();
    console.log('Tables synced');
  } catch (err) {
    console.error('Unable to sync tables:', err);
  }
};

module.exports = { db, syncTables };
