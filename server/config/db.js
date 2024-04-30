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
    await checkExistingDiseases();
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

const checkExistingDiseases = async () => {
  const Disease = require('../models/diseaseModel');
  const requiredDiseases = [
    'Захворювання серця',
    'Інфаркт міокарда',
    'Захворювання судин',
    'Інсульт',
    'Підвищений або понижений артеріальний тиск',
    'Захворювання легень',
    'Бронхіальна астма',
    'Захворювання ШКТ',
    'Захворювання печінки',
    'Захворювання нирок',
    'Захворювання щитоподібної, паращитоподібної та інших залоз',
    'Цукровий діабет',
    'Травми',
    'Забій головного мозку',
    'Епілепсія чи інші захворювання нервової системи',
    'Захворювання крові',
    'Порушення згортання крові',
    'Захворювання ЛОР-органів',
    'Глаукома',
    'Захворювання опорно-рухового апарату',
    'Захворювання шкіри',
    'Нейродерміт (атопічний дерматит)',
    'Захворювання ВІЛ/СНІД',
    'Грибкові захворювання',
    'Довготривала лихоманка',
    'Збільшення лімфатичних вузлів',
    'Підвищена нічна пітливість',
    'Діарея',
    'Безпричинні головні болі',
    'Венеричні захворювання',
    'Чи були коли небудь ви донором?',
    'Чи проводилось переливання крові?',
    'Інфекційні захворювання',
    'Чи проводилась хіміо- або променева терапія (останні 10 років)?',
    'Операції',
    'Інші захворювання',
    'Чи буває запаморочення, втрата свідомості при введені чи прийомі лікарських засобів?',
    'Гепатит A, B, C',
    // алергічні реакції
    'Алергія на місцеві анестетики',
    'Алергія на антибіотики',
    'Алергія на сульфаніламіди',
    'Алергія на препарати йоду',
    'Алергія на гормональні препарати',
    'Алергія на пилок від рослин',
    'Алергія на продукти харчування',
    'Алергія на шерсть тварин',
    'Постійно або періодично приймаю лікарські засоби',
    // стоматологічний анамнез
    'Наявність дискомфорту з боку СНЩС',
    'Кровотечі ясен при чищенні зубів',
    'Чи часто виникають прояви герпесу на губах?',
    'Бруксизм',
    'Періодична або постійна сухість в ротовій порожнині?',
    'Чи відчуваєте неприємний запах в ротовій порожнині?',
    'Шкідливі звички',
    // для пацієнток
    'Вагітність',
    'Годуюча мати',
  ];
  const existingDiseases = await Disease.findAll();

  // Check if all required diseases exist
  for (const name of requiredDiseases) {
    const diseaseExists = existingDiseases.some(
      (existingDisease) => existingDisease.name === name
    );
    if (!diseaseExists) {
      await Disease.create({ name });
      // console.log(`Disease '${name}' created`);
    } else {
      // console.log(`Disease '${name}' already exists`);
    }
  }
};

module.exports = { db, syncTables };
