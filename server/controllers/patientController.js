const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel');

// @desc    Register a new patient
// @route   POST /api/patients/create
// @access  Public
const createPatient = asyncHandler(async (req, res) => {
  const { surname, name, patronymic, phone, email, birthdate, address, notes } = req.body;

  // чи зробити перевірку тільки на клієнті??
  if (!name || !phone) {
    res.status(400);
    throw new Error('You need to fill at least name and phone');
  }

  const patient = await Patient.create({
    surname,
    name,
    patronymic,
    phone,
    email,
    birthdate,
    address,
    notes,
  });

  res.status(201).json({
    uuid: patient.uuid,
    surname: patient.surname,
    name: patient.name,
    patronymic: patient.patronymic,
    phone: patient.phone,
    email: patient.email,
    birthdate: patient.birthdate,
    address: patient.address,
    notes: patient.notes,
  });
});

// @desc    Get a patient
// @route   Get /api/patients/get/:uuid
// @access  Public
const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ where: { uuid: req.params.uuid } });
  if (patient) {
    res.json(patient);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

// @desc    Get a all patients
// @route   Get /api/patients/all
// @access  Public
const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.findAll();
  if (patients) {
    res.json(patients);
  } else {
    res.status(404);
    throw new Error('Patients not found');
  }
});

// @desc    Delete a patient
// @route   DELETE /api/patients/delete/:uuid
// @access  Public
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ where: { uuid: req.params.uuid } });
  if (patient) {
    await patient.destroy();
    res.json({ message: 'Patient deleted' });
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

// @desc    Update a patient
// @route   PUT /api/patients/update/:uuid
// @access  Public
const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ where: { uuid: req.params.uuid } });
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  const { surname, name, patronymic, phone, email, birthdate, address, notes } = req.body;

  await patient.set({
    surname,
    name,
    patronymic,
    phone,
    email,
    birthdate,
    address,
    notes,
  });
  await patient.save();

  if (patient) {
    res.status(200).json({
      uuid: patient.uuid,
      surname: patient.surname,
      name: patient.name,
      patronymic: patient.patronymic,
      phone: patient.phone,
      email: patient.email,
      birthdate: patient.birthdate,
      address: patient.address,
      notes: patient.notes,
    });
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

const updatePatient2 = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ where: { uuid: req.params.uuid } });

  if (patient) {
    const { surname, name, patronymic, phone, email, birthdate, address, notes } =
      req.body;

    patient.surname = surname || patient.surname;
    patient.name = name || patient.name;
    patient.patronymic = patronymic || patient.patronymic;
    patient.phone = phone || patient.phone;
    patient.email = email || patient.email;
    patient.birthdate = birthdate || patient.birthdate;
    patient.address = address || patient.address;
    patient.notes = notes || patient.notes;

    await patient.save();

    res.json({
      uuid: patient.uuid,
      surname: patient.surname,
      name: patient.name,
      patronymic: patient.patronymic,
      phone: patient.phone,
      email: patient.email,
      birthdate: patient.birthdate,
      address: patient.address,
      notes: patient.notes,
    });
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

module.exports = {
  createPatient,
  getPatient,
  getPatients,
  deletePatient,
  updatePatient,
};
