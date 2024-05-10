const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel');
const { Op } = require('sequelize');
const Appointment = require('../models/appointmentModel');
const Receipt = require('../models/receiptModel');
const Service = require('../models/serviceModel');

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
// @route   Get /api/patients/all?limit=&offset=
// @access  Public
const getPatients = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const patients = await Patient.findAll({
    order: [['surname', 'ASC']],
    limit: parseInt(limit),
    offset: parseInt(offset),
    subQuery: false,
  });
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

  patient.set({
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

// @desc   Find a patient by phone
// @route  GET /api/patients/findbyphone?phone=
// @access Public
const findPatientByPhone = asyncHandler(async (req, res) => {
  const { phone } = req.query;
  const result = await Patient.findAll({
    where: {
      phone: { [Op.substring]: phone },
    },
    // attributes: ['uuid', 'surname', 'name', 'patronymic', 'phone'],
    order: [['surname', 'ASC']],
  });

  if (result) {
    res.json(result);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

// @desc   Find a patient by full name (surname, name, patronymic)
// @route  GET /api/patients/findbyname?surname=&name=&patronymic=
// @access Public
const findPatientByName = asyncHandler(async (req, res) => {
  // Split the query into words on client
  const { surname, name, patronymic } = req.query;
  const result = await Patient.findAll({
    where: {
      surname: { [Op.substring]: surname },
      name: { [Op.substring]: name },
      patronymic: { [Op.substring]: patronymic },
    },
    // attributes: ['uuid', 'surname', 'name', 'patronymic'],
    order: [['surname', 'ASC']],
  });

  if (result) {
    res.json(result);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

// @desc    Find all patient's appointments and receipts
// @route   GET /api/patients/appointments/:uuid
// @access  Public
const findAppointments = asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.uuid);

  const patientsAppointments = await Appointment.findAll({
    where: { patientUuid: req.params.uuid },
    include: [
      {
        model: Receipt,
        include: [
          {
            model: Service,
            through: { attributes: ['quantity'] },
          },
        ],
      },
    ],
  });

  if (patientsAppointments) {
    res.json({
      patient: {
        uuid: patient.uuid,
        surname: patient.surname,
        name: patient.name,
      },
      appointments: patientsAppointments,
    });
  } else {
    res.status(404);
    throw new Error('Patient`s appointments not found');
  }
});

// @desc    Find all patient's receipts
// @route   GET /api/patients/receipts/:uuid
// @access  Public
// const findReceipts = asyncHandler(async (req, res) => {
//   const patient = await Patient.findByPk(req.params.uuid);
//   if (!patient) {
//     res.status(404);
//     throw new Error('Patient not found');
//   }

//   const receipts = await patient.getReceipts();
//   if (receipts) {
//     res.json(receipts);
//   } else {
//     res.status(404);
//     throw new Error('Receipts not found');
//   }
// });

module.exports = {
  createPatient,
  getPatient,
  getPatients,
  deletePatient,
  updatePatient,
  findPatientByPhone,
  findPatientByName,
  findAppointments,
};
