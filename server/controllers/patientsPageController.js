const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Patient = require('../models/patientModel');
const TreatmentPlanRecord = require('../models/treatmentPlanRecordModel');
const { Op } = require('sequelize');

// @desc    Create a page for a patient (administrator or main)
// @route   POST /api/patientspage/create
// @access  Private
const createPage = asyncHandler(async (req, res) => {
  const { login, password, patientUuid } = req.body;

  // чи зробити перевірку тільки на клієнті??
  if (!login || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // Check if user's role is 'administrator' or 'main'
  const findUser = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUser.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'administrator')) {
    res.status(400);
    throw new Error('User is not a main admin or an administrator');
  }

  const patient = await Patient.findByPk(patientUuid);
  if (!patient) {
    res.status(400);
    throw new Error('Patient not found');
  }

  // Check if login and password are not null
  if (patient.login !== null && patient.password !== null) {
    res.status(400);
    throw new Error('The login and password are already set');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create login and password for a patient
  patient.set({
    login: login,
    password: hashedPassword,
  });
  await patient.save();

  if (patient) {
    res.status(201).json({
      uuid: patient.uuid,
      login: patient.login,
      // password: patient.password, // for testing purposes => working
      token: generateToken(patient.uuid),
    });
  } else {
    res.status(400);
    throw new Error('Invalid patient`s auth data');
  }
});

// @desc    Login a patient
// @route   POST /api/patientspage/login
// @access  Public
const loginPatient = asyncHandler(async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // Check if user exists
  const patient = await Patient.findOne({ where: { login } });
  if (!patient) {
    res.status(400);
    throw new Error('Invalid email or password');
  }

  if (patient && (await bcrypt.compare(password, patient.password))) {
    res.json({
      uuid: patient.uuid,
      login: patient.login,
      // password: patient.password, // for testing => working
      token: generateToken(patient.uuid),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get all treatment plans for a patient
// @route   GET /api/patientspage/all/tplans?limit=&offset=
// @access  Private
const getAllPlans = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const patient = await Patient.findByPk(req.patient.uuid);
  if (!patient) {
    res.status(400);
    throw new Error('Patient not found');
  }

  const allTrPlans = await Patient.findByPk(patient.uuid, {
    include: [
      {
        model: TreatmentPlanRecord,
        through: { attributes: [] },
      },
    ],
    order: [[TreatmentPlanRecord, 'date', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset),
    subQuery: false,
  });

  if (allTrPlans) {
    res.json({
      patient: patient.uuid,
      surname: patient.surname,
      name: patient.name,
      treatmentPlans: allTrPlans.treatmentPlanRecords,
    });
  } else {
    res.status(404);
    throw new Error('Treatment plans not found');
  }
});

// @desc    Find the treatment plan record by date
// @route   GET /api/patientspage/findtplans?date=&month=&year=
// @access  Private
const findPlansByDate = asyncHandler(async (req, res) => {
  const { date, month, year } = req.query;
  const patient = await Patient.findByPk(req.patient.uuid);
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }
  if (!date && !month && !year) {
    res.status(400);
    throw new Error('Please provide a date, month or year');
  }
  if (date < 1 || date > 31) {
    res.status(400);
    throw new Error('Invalid date');
  }
  if (month < 1 || month > 12) {
    res.status(400);
    throw new Error('Invalid month');
  }
  if (year < 2000 || year > 2100) {
    res.status(400);
    throw new Error('Invalid year');
  }

  const searchDate = `${year}-${month}-${date}`;
  const tPlans = await Patient.findByPk(patient.uuid, {
    attributes: ['uuid', 'surname', 'name'],
    include: [
      {
        model: TreatmentPlanRecord,
        through: { attributes: [] },
        where: {
          date: {
            [Op.eq]: searchDate,
          },
        },
      },
    ],
  });

  if (tPlans) {
    res.json(tPlans);
  } else {
    res.status(404);
    throw new Error('Treatment plans not found');
  }
});

// @desc    Get a treatment plan for a patient
// @route   GET /api/patientspage/tplan/:uuid
// @access  Private
const getTreatmentPlan = asyncHandler(async (req, res) => {
  const planRecord = await TreatmentPlanRecord.findByPk(req.params.uuid);

  const patient = await Patient.findByPk(req.patient.uuid);
  if (!patient) {
    res.status(400);
    throw new Error('Patient not found');
  }

  if (planRecord) {
    res.json({
      patient: patient.uuid,
      uuid: planRecord.uuid,
      date: planRecord.date,
      examination: planRecord.examination,
      treatment: planRecord.treatment,
    });
  } else {
    res.status(404);
    throw new Error('Treatment plan not found');
  }
});

// @desc    Get a patient's page
// @route   GET /api/patientspage/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.patient);
});

// @desc    Delete a patient's page
// @route   DELETE /api/patientspage/delete/:uuid
// @access  Private (for administrator, main) or auto delete after deleting a patient
const deletePage = asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.uuid);

  if (!patient) {
    res.status(400);
    throw new Error('Patient not found');
  }

  // Check if user's role is 'administrator' or 'main'
  const findUser = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUser.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'administrator')) {
    res.status(400);
    throw new Error('User is not a main admin or an administrator');
  }

  patient.set({
    login: null,
    password: null,
  });
  await patient.save();

  res.status(200).json('Patient page login and password deleted successfully');
});

// @desc    Update a patient's page info (only login and password are allowed)
// @route   PUT /api/patientspage/update
// @access  Private
const updatePageInfo = asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.patient.uuid);

  if (!patient) {
    res.status(400);
    throw new Error('Patient not found');
  }

  const { login, password } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  patient.set({
    login,
    password: hashedPassword,
  });
  await patient.save();

  if (patient) {
    res.json(patient);
  } else {
    res.status(400);
    throw new Error('Couldn`t update patient`s data');
  }
});

// @desc    Generate JWT
// @access  Private
const generateToken = (uuid) => {
  return jwt.sign({ uuid }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  createPage,
  loginPatient,
  getMe,
  getTreatmentPlan,
  getAllPlans,
  deletePage,
  updatePageInfo,
  findPlansByDate,
};
