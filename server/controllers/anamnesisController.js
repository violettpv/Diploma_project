const asyncHandler = require('express-async-handler');
const Anamnesis = require('../models/anamnesisModel');
const Disease = require('../models/diseaseModel');
const Patient = require('../models/patientModel');

// @desc    Create a new anamnesis
// @route   POST /api/anamnesis/create
// @access  Public
const createAnamnesis = asyncHandler(async (req, res) => {
  const { patientUuid, diseaseUuid, note } = req.body;

  // Need to fill at least one field
  // (for example, diseaseUuid == '39280d6e-2a51-4e49-956d-c37935c18513' == 'Повністю здоровий')
  if (!patientUuid && !diseaseUuid) {
    res.status(400);
    throw new Error('Please fill at least one field');
  }

  // check if anamnesis already exists
  const anamnesisExists = await Anamnesis.findOne({
    where: { patientUuid, diseaseUuid },
  });
  if (anamnesisExists) {
    res.status(400);
    throw new Error('This anamnesis already exists');
  }

  const anamnesis = await Anamnesis.create({ patientUuid, diseaseUuid, note });

  if (anamnesis) {
    res.status(201).json({
      uuid: anamnesis.uuid,
      patientUuid: anamnesis.patientUuid,
      diseaseUuid: anamnesis.diseaseUuid,
      note: anamnesis.note,
    });
  } else {
    res.status(400);
    throw new Error('Invalid anamnesis data');
  }
});

// @desc    Get an anamnesis of a patient
// @route   Get /api/anamnesis/get/:uuid
// @access  Public
const getAnamnesis = asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.uuid);
  const anamnesis = await Patient.findByPk(patient.uuid, {
    include: [
      {
        model: Disease,
        through: { attributes: [] },
      },
    ],
    order: [[Disease, 'name', 'ASC']],
  });

  if (anamnesis) {
    res.json({
      patient: patient.uuid,
      surname: patient.surname,
      name: patient.name,
      anamnesis: anamnesis.diseases,
    });
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
// @access  Public
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
// @access  Private. For development only
const updateAnamnesis = asyncHandler(async (req, res) => {
  const anamnesis = await Anamnesis.findOne({ where: { uuid: req.params.uuid } });
  if (!anamnesis) {
    res.status(404);
    throw new Error('Anamnesis not found');
  }

  const { patiendUuid, diseaseUuid, note } = req.body;
  await anamnesis.set({ patiendUuid, diseaseUuid, note });
  await anamnesis.save();

  if (anamnesis) {
    res.status(200).json({
      uuid: anamnesis.uuid,
      patientUuid: anamnesis.patientUuid,
      diseaseUuid: anamnesis.diseaseUuid,
      note: anamnesis.note,
    });
  } else {
    res.status(400);
    throw new Error('Invalid anamnesis data');
  }
});

module.exports = {
  createAnamnesis,
  getAnamnesis,
  deleteAnamnesis,
  updateAnamnesis,
  getAllAnamnesis,
};
