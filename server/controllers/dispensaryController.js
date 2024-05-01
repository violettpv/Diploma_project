const asyncHandler = require('express-async-handler');
const Dispensary = require('../models/dispensaryModel');
const User = require('../models/userModel');
const Role = require('../models/roleModel');

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

  // Check if user's role is 'doctor' or 'main'
  const findUsersRole = await User.findOne({
    where: { uuid: userUuid },
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'doctor' || usersRole === 'main')) {
    res.status(400);
    throw new Error('User is not a doctor or main admin');
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
      // check user's role
      usersRole: findUsersRole.roles,
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
  const dispensary = await Dispensary.findOne({
    where: { patientUuid: req.params.uuid },
  });
  if (dispensary) {
    res.json(dispensary);
  } else {
    res.status(404);
    throw new Error('Dispensary not found');
  }
});

// @desc    Get all dispensary records
// @route   Get /api/dispensary/all
// @access  Public
const getAllDispensary = asyncHandler(async (req, res) => {
  const dispensary = await Dispensary.findAll();
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

  await dispensary.set({
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

module.exports = {
  createDispensary,
  getDispensary,
  deleteDispensary,
  updateDispensary,
  getAllDispensary,
};
