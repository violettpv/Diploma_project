const asyncHandler = require('express-async-handler');
const Anamnesis = require('../models/anamnesisModel');
const Disease = require('../models/diseaseModel');
const Patient = require('../models/patientModel');

// @desc    Get all diseases
// @route   Get /api/anamnesis/diseases
// @access  Public
const getDiseases = asyncHandler(async (req, res) => {
  const diseases = await Disease.findAll();
  if (diseases) {
    res.json(diseases);
  } else {
    res.status(404);
    throw new Error('Diseases not found');
  }
});

// @desc    Get an anamnesis of a patient
// @route   Get /api/anamnesis/get/:uuid
// @access  Public
const getAnamnesis = asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.uuid);
  const anamnesis = await Anamnesis.findOne({
    where: { patientUuid: patient.uuid },
    include: [
      {
        model: Patient,
        attributes: ['surname', 'name', 'patronymic'],
      },
    ],
  });

  if (anamnesis) {
    res.json(anamnesis);
  } else {
    res.status(404);
    throw new Error('Anamnesis not found');
  }
});

// @desc    Get all anamnesis table
// @route   Get /api/anamnesis/all
// @access  Private. For development only
const getAllAnamnesis = asyncHandler(async (req, res) => {
  const anamnesis = await Anamnesis.findAll();
  if (anamnesis) {
    res.json(anamnesis);
  } else {
    res.status(404);
    throw new Error('Anamnesis not found');
  }
});

// @desc    Delete an anamnesis
// @route   DELETE /api/anamnesis/delete/:uuid
// @access  Public or PRIVATE. For development only
const deleteAnamnesis = asyncHandler(async (req, res) => {
  const anamnesis = await Anamnesis.findOne({ where: { uuid: req.params.uuid } });
  if (anamnesis) {
    await anamnesis.destroy();
    res.json({ message: 'Anamnesis removed' });
  } else {
    res.status(404);
    throw new Error('Anamnesis not found');
  }
});

// @desc    Update an anamnesis
// @route   PUT /api/anamnesis/update/:uuid
// @access  Public
const updateAnamnesis = asyncHandler(async (req, res) => {
  const anamnesis = await Anamnesis.findOne({ where: { uuid: req.params.uuid } });
  if (!anamnesis) {
    res.status(404);
    throw new Error('Anamnesis not found');
  }

  const { jsonAnamnesis } = req.body;
  anamnesis.set({ jsonAnamnesis });
  await anamnesis.save();

  if (anamnesis) {
    res.status(200).json({
      uuid: anamnesis.uuid,
      patientUuid: anamnesis.patientUuid,
      jsonAnamnesis: anamnesis.jsonAnamnesis,
    });
  } else {
    res.status(400);
    throw new Error('Invalid anamnesis data');
  }
});

// @desc    Create anamnesis for all patients who have no anamnesis
// @route   POST /api/anamnesis/createAll
// @access  Private. For development only
const createAllAnamnesis = asyncHandler(async (req, res) => {
  const patients = await Patient.findAll();

  patients.forEach(async (patient) => {
    const anamnesisExists = await Anamnesis.findOne({
      where: { patientUuid: patient.uuid },
    });
    if (!anamnesisExists) {
      await Anamnesis.create({ patientUuid: patient.uuid, jsonAnamnesis: {} });
    }
  });

  res.json({ message: 'Anamnesis created for all patients' });
});

module.exports = {
  getDiseases,
  getAnamnesis,
  // deleteAnamnesis,
  updateAnamnesis,
  getAllAnamnesis,
};
