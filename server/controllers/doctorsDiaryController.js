const asyncHandler = require('express-async-handler');
const DoctorsDiaryRecord = require('../models/doctorsDiaryRecordModel');
const DoctorsDiary = require('../models/doctorsDiaryModel');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Patient = require('../models/patientModel');

// @desc    Create a new doctor's diary record
// @route   POST /api/docsdiary/create
// @access  Private
const createDDRecord = asyncHandler(async (req, res) => {
  const {
    patientUuid,
    date,
    complaints,
    anamnesis,
    status,
    diagnosis,
    treatment,
    recommendations,
  } = req.body;
  if (!patientUuid || !date || !anamnesis || !status) {
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

  const diaryRecord = await DoctorsDiaryRecord.create({
    patientUuid,
    date,
    complaints,
    anamnesis,
    status,
    diagnosis,
    treatment,
    recommendations,
  });
  const docsDiary = await DoctorsDiary.create({
    patientUuid,
    doctorsDiaryRecordUuid: diaryRecord.uuid,
  });

  if (docsDiary && diaryRecord) {
    res.status(201).json({
      uuid: docsDiary.uuid,
      patientUuid: docsDiary.patientUuid,
      doctorsDiaryRecordUuid: docsDiary.doctorsDiaryRecordUuid,
      dDiaryRecordUuid: diaryRecord.uuid, // dublicate for testing purposes
      date: diaryRecord.date,
      complaints: diaryRecord.complaints,
      anamnesis: diaryRecord.anamnesis,
      status: diaryRecord.status,
      diagnosis: diaryRecord.diagnosis,
      treatment: diaryRecord.treatment,
      recommendations: diaryRecord.recommendations,
    });
  } else {
    res.status(400);
    throw new Error('Invalid doctor`s diary  data');
  }
});

// @desc    Get the doctor's diary record by uuid
// @route   GET /api/docsdiary/get/:uuid
// @access  Private
const getDDRecord = asyncHandler(async (req, res) => {
  const diaryRecord = await DoctorsDiaryRecord.findByPk(req.params.uuid);

  // Check if user's role is 'main' or 'doctor'
  const findUsersRole = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin or a doctor');
  }

  if (diaryRecord) {
    res.json({
      uuid: diaryRecord.uuid,
      date: diaryRecord.date,
      complaints: diaryRecord.complaints,
      anamnesis: diaryRecord.anamnesis,
      status: diaryRecord.status,
      diagnosis: diaryRecord.diagnosis,
      treatment: diaryRecord.treatment,
      recommendations: diaryRecord.recommendations,
    });
  } else {
    res.status(404);
    throw new Error('Doctor`s diary record not found');
  }
});

// @desc    Get all dotor's diary records of a patient
// @route   GET /api/docsdiary/all/:uuid
// @access  Private
const getAllRecordsOfPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.uuid);
  const diaryRecords = await Patient.findByPk(patient.uuid, {
    order: [[DoctorsDiaryRecord, 'date', 'DESC']],
    include: [
      {
        model: DoctorsDiaryRecord,
        through: { attributes: [] },
      },
    ],
    order: [[DoctorsDiaryRecord, 'date', 'DESC']],
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

  if (diaryRecords) {
    res.json({
      patient: patient.uuid,
      surname: patient.surname,
      name: patient.name,
      diaryRecords: diaryRecords.doctorsDiaryRecords,
    });
  } else {
    res.status(404);
    throw new Error('Doctor`s diary records not found');
  }
});

// @desc    Delete the doctor`s diary record
// @route   DELETE /api/docsdiary/delete/:uuid
// @access  Private
const deleteDDRecord = asyncHandler(async (req, res) => {
  const diaryRecord = await DoctorsDiaryRecord.findOne({
    where: { uuid: req.params.uuid },
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

  if (diaryRecord) {
    await diaryRecord.destroy();
    res.json({ message: 'Doctor`s diary record removed' });
  } else {
    res.status(404);
    throw new Error('Doctor`s diary record not found');
  }
});

// @desc    Update the doctor`s diary record
// @route   PUT /api/docsdiary/update/:uuid
// @access  Private
const updateDDRecord = asyncHandler(async (req, res) => {
  const diaryRecord = await DoctorsDiaryRecord.findByPk(req.params.uuid);

  if (!diaryRecord) {
    res.status(404);
    throw new Error('Treatment plan not found');
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

  const { date, complaints, anamnesis, status, diagnosis, treatment, recommendations } =
    req.body;

  diaryRecord.set({
    date,
    complaints,
    anamnesis,
    status,
    diagnosis,
    treatment,
    recommendations,
  });
  await diaryRecord.save();

  if (diaryRecord) {
    res.json({
      uuid: diaryRecord.uuid,
      date: diaryRecord.date,
      complaints: diaryRecord.complaints,
      anamnesis: diaryRecord.anamnesis,
      status: diaryRecord.status,
      diagnosis: diaryRecord.diagnosis,
      treatment: diaryRecord.treatment,
      recommendations: diaryRecord.recommendations,
    });
  } else {
    res.status(400);
    throw new Error('Invalid doctor`s diary record data');
  }
});

module.exports = {
  createDDRecord,
  getDDRecord,
  deleteDDRecord,
  updateDDRecord,
  getAllRecordsOfPatient,
};
