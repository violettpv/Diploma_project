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
  const MessageTemplate = require('../models/messageTemplateModel');

  // Assosiations / Relationships
  // M:M
  User.belongsToMany(Role, { through: UsersRole });
  Role.belongsToMany(User, { through: UsersRole });
  // 1:1
  Patient.hasOne(Anamnesis);
  Anamnesis.belongsTo(Patient);
  // M:M
  Receipt.belongsToMany(Service, { through: ReceiptService });
  Service.belongsToMany(Receipt, { through: ReceiptService });
  // 1:1
  Receipt.hasOne(Appointment);
  Appointment.belongsTo(Receipt);
  // 1:M (Sequilize doesn't support non-unique FKs, so we can't use M:M here)
  Patient.hasMany(Appointment);
  Appointment.belongsTo(Patient);
  User.hasMany(Appointment);
  Appointment.belongsTo(User);
  // 1:M (Sequilize doesn't support non-unique FKs, so we can't use M:M here)
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
    // await Patient.bulkCreate(patientsData);
    await checkExistingRoles();
    await checkExistingDiseases();
    await createReminderTemplate();
    console.log('Tables synced');
  } catch (err) {
    console.error('Unable to sync tables:', err);
  }
};

const patientsData = [
  {
    surname: 'Коваль',
    name: 'Ірина',
    patronymic: 'Володимирівна',
    birthdate: '1987-01-12',
    phone: '+380631234570',
    email: 'i.koval87@gmail.com',
  },
  {
    surname: 'Лисенко',
    name: 'Павло',
    patronymic: 'Ігорович',
    birthdate: '1991-02-25',
    phone: '+380981234570',
    address: 'Київ, вул. Шевченка, 10',
  },
  {
    surname: 'Гончар',
    name: 'Ольга',
    patronymic: 'Миколаївна',
    birthdate: '1976-07-03',
    phone: '+380501234570',
  },
  {
    surname: 'Демченко',
    name: 'Олександр',
    patronymic: 'Юрійович',
    birthdate: '1983-11-19',
    phone: '+380671234570',
    note: 'Пацієнт з астмою',
  },
  {
    surname: 'Мартинюк',
    name: 'Вікторія',
    patronymic: 'Сергіївна',
    birthdate: '1995-04-15',
    phone: '+380931234570',
  },
  {
    surname: 'Федоренко',
    name: 'Анатолій',
    patronymic: 'Олексійович',
    birthdate: '1980-09-29',
    phone: '+380961234570',
    email: 'a.fedorenko80@ukr.net',
  },
  {
    surname: 'Левченко',
    name: 'Наталія',
    patronymic: 'Іванівна',
    birthdate: '1988-03-22',
    phone: '+380671234571',
  },
  {
    surname: 'Кириленко',
    name: 'Василь',
    patronymic: 'Степанович',
    birthdate: '1979-12-30',
    phone: '+380501234571',
    address: 'Львів, вул. Городоцька, 23',
  },
  {
    surname: 'Савченко',
    name: 'Марина',
    patronymic: 'Олегівна',
    birthdate: '1993-08-05',
    phone: '+380981234571',
  },
  {
    surname: 'Романенко',
    name: 'Олексій',
    patronymic: 'Михайлович',
    birthdate: '1985-05-14',
    phone: '+380631234571',
    email: 'o.romanenk85@mail.ua',
  },
  {
    surname: 'Яровий',
    name: 'Дмитро',
    patronymic: 'Борисович',
    birthdate: '1990-10-10',
    phone: '+380991234570',
  },
  {
    surname: 'Тимошенко',
    name: 'Інна',
    patronymic: 'Григорівна',
    birthdate: '1982-06-07',
    phone: '+380961234571',
    note: 'Алергія на пил',
  },
  {
    surname: 'Захаренко',
    name: 'Галина',
    patronymic: 'Петрівна',
    birthdate: '1997-11-25',
    phone: '+380671234572',
  },
  {
    surname: 'Онищенко',
    name: 'Євген',
    patronymic: 'Васильович',
    birthdate: '1978-04-17',
    phone: '+380501234572',
    email: 'e.onischenko78@gmail.com',
  },
  {
    surname: 'Руденко',
    name: 'Катерина',
    patronymic: 'Андріївна',
    birthdate: '1994-01-30',
    phone: '+380981234572',
    address: 'Одеса, вул. Дерибасівська, 5',
  },
];

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
    // Повністю відсутні
    'Повністю здоровий',
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

const createReminderTemplate = async () => {
  const MessageTemplate = require('../models/messageTemplateModel');
  const visitReminder = {
    name: 'Scheduled visit',
    body: 'У Вас заплановано візит до стоматолога на {date} о {time}. Адреса: {clinicAddress}. З повагою, {clinicName}. Телефон: {clinicPhone}',
  };

  const existingTemplate = await MessageTemplate.findOne({
    where: { name: visitReminder.name },
  });

  if (!existingTemplate) {
    await MessageTemplate.create(visitReminder);
    // console.log('Visit reminder template created');
  }
  // else {
  //   console.log('Visit reminder template already exists');
  // }
};

module.exports = { db, syncTables };
