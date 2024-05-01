const asyncHandler = require('express-async-handler');
const Form043 = require('../models/form043Model');

// ПРОТЕСТИТИ!!!!!!!!!!!!

// @desc    Create a new form043
// @route   POST /api/form043/create
// @access  Public
const createForm043 = asyncHandler(async (req, res) => {
  const {
    patientUuid,
    diagnosis,
    complaints,
    transferredAndAssociatedDiseases,
    oclussion,
    medicalExaminationData,
    researchData,
    vitaScale,
    oralHealthTrainingData,
    oralHygieneControlData,
  } = req.body;

  if (!patientUuid) {
    res.status(400);
    throw new Error('Please fill patientUuid field');
  }

  // Check if user's role is 'main' or 'doctor'
  const userUuid = req.user.uuid;
  const findUsersRole = await User.findOne({
    where: { uuid: userUuid },
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin');
  }

  // Check if form043 already exists with the same patientUuid
  const form043Exists = await Form043.findOne({ where: { patientUuid } });
  if (form043Exists) {
    res.status(400);
    throw new Error('The form043 already exists');
  }

  const form043 = await Form043.create({
    patientUuid,
    diagnosis,
    complaints,
    transferredAndAssociatedDiseases,
    oclussion,
    medicalExaminationData,
    researchData,
    vitaScale,
    oralHealthTrainingData,
    oralHygieneControlData,
  });

  if (form043) {
    res.status(201).json({
      uuid: form043.uuid,
      patientUuid: form043.patientUuid,
      diagnosis: form043.diagnosis,
      complaints: form043.complaints,
      transferredAndAssociatedDiseases: form043.transferredAndAssociatedDiseases,
      oclussion: form043.oclussion,
      medicalExaminationData: form043.medicalExaminationData,
      researchData: form043.researchData,
      vitaScale: form043.vitaScale,
      oralHealthTrainingData: form043.oralHealthTrainingData,
      oralHygieneControlData: form043.oralHygieneControlData,
    });
  } else {
    res.status(400);
    throw new Error('Invalid form043 data');
  }
});

// @desc    Get a form043 of a patient
// @route   Get /api/form043/get/:uuid
// @access  Public
const getForm043 = asyncHandler(async (req, res) => {
  const form043 = await Form043.findOne({ where: { patientUuid: req.params.uuid } });

  // Check if user's role is 'main' or 'doctor'
  const userUuid = req.user.uuid;
  const findUsersRole = await User.findOne({
    where: { uuid: userUuid },
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin');
  }

  if (form043) {
    res.json(form043);
  } else {
    res.status(404);
    throw new Error('Form043 not found');
  }
});

// @desc    Get all form043s
// @route   Get /api/form043/all
// @access  Private. For development only
const getAllForm043s = asyncHandler(async (req, res) => {
  const form043s = await Form043.findAll({ order: [['uuid', 'DESC']] });
  if (form043s) {
    res.json(form043s);
  } else {
    res.status(404);
    throw new Error('Form043s not found');
  }
});

// @desc    Delete a form043
// @route   DELETE /api/form043/delete/:uuid
// @access  Private. For development only
const deleteForm043 = asyncHandler(async (req, res) => {
  const form043 = await Form043.findOne({ where: { patientUuid: req.params.uuid } });
  if (form043) {
    await form043.destroy();
    res.json({ message: 'Form043 removed' });
  } else {
    res.status(404);
    throw new Error('Form043 not found');
  }
});

// @desc    Update a form043
// @route   PUT /api/form043/update/:uuid
// @access  Public
const updateForm043 = asyncHandler(async (req, res) => {
  const form043 = await Form043.findOne({ where: { uuid: req.params.uuid } });
  if (!form043) {
    res.status(404);
    throw new Error('Form043 not found');
  }

  // Check if user's role is 'main' or 'doctor'
  const userUuid = req.user.uuid;
  const findUsersRole = await User.findOne({
    where: { uuid: userUuid },
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin');
  }

  const {
    diagnosis,
    complaints,
    transferredAndAssociatedDiseases,
    oclussion,
    medicalExaminationData,
    researchData,
    vitaScale,
    oralHealthTrainingData,
    oralHygieneControlData,
  } = req.body;

  await form043.set({
    diagnosis,
    complaints,
    transferredAndAssociatedDiseases,
    oclussion,
    medicalExaminationData,
    researchData,
    vitaScale,
    oralHealthTrainingData,
    oralHygieneControlData,
  });
  await form043.save();

  if (form043) {
    res.status(200).json({
      uuid: form043.uuid,
      patientUuid: form043.patientUuid,
      diagnosis: form043.diagnosis,
      complaints: form043.complaints,
      transferredAndAssociatedDiseases: form043.transferredAndAssociatedDiseases,
      oclussion: form043.oclussion,
      medicalExaminationData: form043.medicalExaminationData,
      researchData: form043.researchData,
      vitaScale: form043.vitaScale,
      oralHealthTrainingData: form043.oralHealthTrainingData,
      oralHygieneControlData: form043.oralHygieneControlData,
    });
  } else {
    res.status(400);
    throw new Error('Invalid form043 data');
  }
});

module.exports = {
  createForm043,
  getForm043,
  deleteForm043,
  updateForm043,
  getAllForm043s,
};
