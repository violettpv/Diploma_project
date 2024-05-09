const asyncHandler = require('express-async-handler');
const Dispensary = require('../models/dispensaryModel');
const User = require('../models/userModel');
const Patient = require('../models/patientModel');
const { Op } = require('sequelize');

// @desc    Create a new dispensary record
// @route   POST /api/dispensary/create
// @access  Public
const createDispensary = asyncHandler(async (req, res) => {
  const { patientUuid, userUuid, dateOfTheVisit, timeNeeded, treatment, notes } =
    req.body;

  if (!patientUuid || !userUuid || !dateOfTheVisit || !timeNeeded || !treatment) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  // Check if dateOfTheVisit is today or later
  const today = new Date();
  const dateConverted = new Date(dateOfTheVisit);
  if (dateConverted < today) {
    res.status(400);
    throw new Error('Date of the visit must be today or later');
  }

  const dispensary = await Dispensary.create({
    patientUuid,
    userUuid,
    dateOfTheVisit,
    timeNeeded,
    treatment,
    notes,
  });

  if (dispensary) {
    res.status(201).json({
      uuid: dispensary.uuid,
      patientUuid: dispensary.patientUuid,
      userUuid: dispensary.userUuid,
      dateOfTheVisit: dispensary.dateOfTheVisit,
      timeNeeded: dispensary.timeNeeded,
      treatment: dispensary.treatment,
      notes: dispensary.notes,
    });
  } else {
    res.status(400);
    throw new Error('Invalid dispensary data');
  }
});

// @desc    Get a dispensary record
// @route   Get /api/dispensary/get/:uuid
// @access  Public
const getDispensary = asyncHandler(async (req, res) => {
  const dispensary = await Dispensary.findByPk(req.params.uuid);
  if (dispensary) {
    res.json(dispensary);
  } else {
    res.status(404);
    throw new Error('Dispensary not found');
  }
});

// @desc    Get all dispensary records
// @route   Get /api/dispensary/all?limit=&offset=
// @access  Public
const getAllDispensary = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const dispensary = await Dispensary.findAll({
    order: [['dateOfTheVisit', 'ASC']],
    limit: parseInt(limit),
    offset: parseInt(offset),
    subQuery: false,
  });
  if (dispensary) {
    res.json(dispensary);
  } else {
    res.status(404);
    throw new Error('Dispensary not found');
  }
});

// @desc    Delete a dispensary record
// @route   DELETE /api/dispensary/delete/:uuid
// @access  Public
const deleteDispensary = asyncHandler(async (req, res) => {
  const dispensary = await Dispensary.findOne({ where: { uuid: req.params.uuid } });
  if (dispensary) {
    await dispensary.destroy();
    res.json({ message: 'Dispensary removed' });
  } else {
    res.status(404);
    throw new Error('Dispensary not found');
  }
});

// @desc    Update a dispensary record
// @route   PUT /api/dispensary/update/:uuid
// @access  Public
const updateDispensary = asyncHandler(async (req, res) => {
  const dispensary = await Dispensary.findOne({ where: { uuid: req.params.uuid } });
  if (!dispensary) {
    res.status(404);
    throw new Error('Dispensary record not found');
  }

  const { userUuid, dateOfTheVisit, timeNeeded, treatment, notes } = req.body;

  // Check if dateOfTheVisit is today or in the future
  const today = new Date();
  const dateConverted = new Date(dateOfTheVisit);
  if (dateConverted <= today) {
    res.status(400);
    throw new Error('Date of the visit must be today or later');
  }

  dispensary.set({
    userUuid,
    dateOfTheVisit,
    timeNeeded,
    treatment,
    notes,
  });
  await dispensary.save();

  if (dispensary) {
    res.status(200).json({
      uuid: dispensary.uuid,
      patientUuid: dispensary.patientUuid,
      userUuid: dispensary.userUuid,
      dateOfTheVisit: dispensary.dateOfTheVisit,
      timeNeeded: dispensary.timeNeeded,
      treatment: dispensary.treatment,
      notes: dispensary.notes,
    });
  } else {
    res.status(400);
    throw new Error('Invalid dispensary data');
  }
});

// @desc   Find all dispensary records of the patient
// @route  GET /api/dispensary/findbypatient?surname=&name=&patronymic
// @access Public
const findRecordsOfPatient = asyncHandler(async (req, res) => {
  // Split the query into words on client
  const { surname, name, patronymic } = req.query;
  const result = await Patient.findAll({
    where: {
      surname: { [Op.substring]: surname },
      name: { [Op.substring]: name },
      patronymic: { [Op.substring]: patronymic },
    },
    attributes: ['uuid', 'surname', 'name', 'patronymic'],
    include: [
      {
        model: User,
        attributes: ['uuid', 'surname', 'name', 'patronymic'],
        through: {
          attributes: ['uuid', 'dateOfTheVisit', 'timeNeeded', 'treatment', 'notes'],
        },
      },
    ],
    order: [[User, Dispensary, 'dateOfTheVisit', 'ASC']],
  });

  if (result) {
    res.json(result);
  } else {
    res.status(404);
    throw new Error('Dispensary records not found');
  }
});

// @desc   Find all dispensary records of the user (doctor)
// @route  GET /api/dispensary/findbydoctor?surname=&name=&patronymic
// @access Public
const findRecordsOfDoctor = asyncHandler(async (req, res) => {
  // Split the query into words on client
  const { surname, name, patronymic } = req.query;
  const result = await User.findAll({
    where: {
      surname: { [Op.substring]: surname },
      name: { [Op.substring]: name },
      patronymic: { [Op.substring]: patronymic },
    },
    attributes: ['uuid', 'surname', 'name', 'patronymic'],
    include: [
      {
        model: Patient,
        attributes: ['uuid', 'surname', 'name', 'patronymic'],
        through: {
          attributes: ['uuid', 'dateOfTheVisit', 'timeNeeded', 'treatment', 'notes'],
        },
      },
    ],
    order: [[Patient, Dispensary, 'dateOfTheVisit', 'ASC']],
  });

  if (result) {
    res.json(result);
  } else {
    res.status(404);
    throw new Error('Dispensary records not found');
  }
});

// @desc   Find all dispensary records by date
// @route  GET /api/dispensary/findbydate?date=&month=&year=
// @access Public
const findRecordsByDate = asyncHandler(async (req, res) => {
  const { date, month, year } = req.query;
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
  const records = await Dispensary.findAll({
    where: {
      dateOfTheVisit: {
        [Op.eq]: searchDate,
      },
    },
    order: [['dateOfTheVisit', 'ASC']],
  });

  if (records) {
    res.json(records);
  } else {
    res.status(404);
    throw new Error('Dispensary records not found');
  }
});

module.exports = {
  createDispensary,
  getDispensary,
  deleteDispensary,
  updateDispensary,
  getAllDispensary,
  findRecordsOfPatient,
  findRecordsOfDoctor,
  findRecordsByDate,
};
