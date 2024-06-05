const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Patient = require('../models/patientModel');
const DentalFormula = require('../models/dentalFormulaModel');

// @desc    Create a dental formula
// @route   POST /api/dentalformula/create
// @access  Private
const createDentalFormula = asyncHandler(async (req, res) => {
  const { patientUuid, jsonDentalFormula, note } = req.body;

  if (!jsonDentalFormula || !patientUuid) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  // Check if user's role is 'main' or 'doctor'
  const findUsersRole = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin or a doctor');
  }

  const patient = await Patient.findByPk(patientUuid);
  if (!patient) {
    res.status(400);
    throw new Error('Patient not found');
  }

  const dentalFormula = await DentalFormula.create({
    jsonDentalFormula,
    note,
    patientUuid,
  });

  if (dentalFormula) {
    res.status(201).json({
      uuid: dentalFormula.uuid,
      jsonDentalFormula: dentalFormula.jsonDentalFormula,
      note: dentalFormula.note,
      patientUuid: dentalFormula.patientUuid,
    });
  } else {
    res.status(400);
    throw new Error('Invalid dental formula data');
  }
});

// @desc create dental formulas for all patients who don't have them
// @route POST /api/dentalformula/createall
// @access Private \ For fixing the database
const createAllDentalFormulas = asyncHandler(async (req, res) => {
  const patients = await Patient.findAll();

  if (!patients) {
    res.status(400);
    throw new Error('Patients not found');
  }

  patients.forEach(async (patient) => {
    const dentalFormulaExists = await DentalFormula.findOne({
      where: { patientUuid: patient.uuid },
    });
    if (!dentalFormulaExists) {
      await DentalFormula.create({
        jsonDentalFormula: {},
        patientUuid: patient.uuid,
      });
    }
  });
  res.status(201).json({ message: 'Dental formulas created' });
});

// @desc    Get a dental formula
// @route   GET /api/dentalformula/get/:uuid
// @access  Private
const getDentalFormula = asyncHandler(async (req, res) => {
  const dentalFormula = await DentalFormula.findOne({
    where: { patientUuid: req.params.uuid },
  });

  // Check if user's role is 'main' or 'doctor'
  const findUsersRole = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin or a doctor');
  }

  if (dentalFormula) {
    res.status(200).json({
      uuid: dentalFormula.uuid,
      jsonDentalFormula: dentalFormula.jsonDentalFormula,
      note: dentalFormula.note,
      patientUuid: dentalFormula.patientUuid,
    });
  } else {
    res.status(400);
    throw new Error('Dental formula not found');
  }
});

// @desc    Get all dental formulas
// @route   GET /api/dentalformula/all
// @access  Private (dev only)
const getAllDentalFormulas = asyncHandler(async (req, res) => {
  const dentalFormulas = await DentalFormula.findAll();

  if (dentalFormulas) {
    res.status(200).json(dentalFormulas);
  } else {
    res.status(400);
    throw new Error('Dental formulas not found');
  }
});

// @desc    Delete a dental formula
// @route   DELETE /api/dentalformula/delete/:uuid
// @access  Private (dev only)
const deleteDentalFormula = asyncHandler(async (req, res) => {
  const dentalFormula = await DentalFormula.findByPk(req.params.uuid);

  // Check if user's role is 'main' or 'doctor'
  const findUsersRole = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin or a doctor');
  }

  if (dentalFormula) {
    await dentalFormula.destroy();
    res.status(200).json({ message: 'Dental formula removed' });
  } else {
    res.status(400);
    throw new Error('Dental formula not found');
  }
});

// @desc    Update a dental formula
// @route   PUT /api/dentalformula/update/:uuid
// @access  Private
const updateDentalFormula = asyncHandler(async (req, res) => {
  const { jsonDentalFormula, note } = req.body;
  if (!jsonDentalFormula) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  // Check if user's role is 'main' or 'doctor'
  const findUsersRole = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin or a doctor');
  }

  const dentalFormula = await DentalFormula.findByPk(req.params.uuid);
  if (!dentalFormula) {
    res.status(400);
    throw new Error('Dental formula not found');
  }

  dentalFormula.set({
    jsonDentalFormula,
    note,
  });
  await dentalFormula.save();

  res.status(200).json({
    uuid: dentalFormula.uuid,
    jsonDentalFormula: dentalFormula.jsonDentalFormula,
    note: dentalFormula.note,
    patientUuid: dentalFormula.patientUuid,
  });
});

module.exports = {
  createDentalFormula,
  getDentalFormula,
  deleteDentalFormula,
  updateDentalFormula,
  getAllDentalFormulas,
  createAllDentalFormulas,
};
