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
  const TreatmentPlanRecord = require('../models/treatmentPlanRecordModel');
  const TreatmentPlan = require('../models/treatmentPlanModel');
  const DoctorsDiaryRecord = require('../models/doctorsDiaryRecordModel');
  const DoctorsDiary = require('../models/doctorsDiaryModel');
  const DentalFormula = require('../models/dentalFormulaModel');

  // Assosiations / Relationships
  // M:M
  User.belongsToMany(Role, { through: UsersRole });
  Role.belongsToMany(User, { through: UsersRole });
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
  Patient.belongsToMany(TreatmentPlanRecord, { through: TreatmentPlan });
  TreatmentPlanRecord.belongsToMany(Patient, { through: TreatmentPlan });
  Patient.belongsToMany(DoctorsDiaryRecord, { through: DoctorsDiary });
  DoctorsDiaryRecord.belongsToMany(Patient, { through: DoctorsDiary });

  try {
    await db.sync();
    await checkExistingRoles();
    console.log('Tables synced');
  } catch (err) {
    console.error('Unable to sync tables:', err);
  }
};

const checkExistingRoles = async () => {
  const Role = require('../models/roleModel');
  const requiredRoles = ['main', 'doctor', 'administrator'];
  const existingRoles = await Role.findAll();

  // Check if all required roles exist
  for (const role of requiredRoles) {
    const roleExists = existingRoles.some((existingRole) => existingRole.role === role);
    if (!roleExists) {
      await Role.create({ role });
      // console.log(`Role '${role}' created`);
    }
    // else {
    //   console.log(`Role '${role}' already exists`);
    // }
  }
};

module.exports = { db, syncTables };
