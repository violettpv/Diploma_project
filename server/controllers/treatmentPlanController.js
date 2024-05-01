const asyncHandler = require('express-async-handler');
const TreatmentPlan = require('../models/treatmentPlanModel');
const TreatmentPlanRecord = require('../models/treatmentPlanRecordModel');
const User = require('../models/userModel');
const Role = require('../models/roleModel');

// @desc    Create a new treatment plan
// @route   POST /api/tplan/create
// @access  Private
const createTreatmentPlan = asyncHandler(async (req, res) => {
  const { patientUuid, date, examinationPlan, treatmentPlan } = req.body;
  // treatmentPlanRecordUuid
  if (!patientUuid || !date || !treatmentPlan) {
    res.status(400);
    throw new Error('Please fill all fields');
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
    throw new Error('User is not a main admin or a doctor');
  }

  const trPlanRecord = await TreatmentPlanRecord.create({
    date,
    examinationPlan,
    treatmentPlan,
  });
  const treatmentPlanRecordUuid = trPlanRecord.uuid;
  const trPlan = await TreatmentPlan.create({
    patientUuid,
    treatmentPlanRecordUuid,
  });

  if (trPlan && trPlanRecord) {
    res.status(201).json({
      uuid: trPlan.uuid,
      patientUuid: trPlan.patientUuid,
      treatmentPlanRecordUuid: trPlan.treatmentPlanRecordUuid,
      date: trPlanRecord.date,
      examinationPlan: trPlanRecord.examinationPlan,
      treatmentPlan: trPlanRecord.treatmentPlan,
    });
  } else {
    res.status(400);
    throw new Error('Invalid treatment plan data');
  }
});

// @desc    Get a treatment plan by uuid
// @route   GET /api/tplan/get/:uuid
// @access  Private
const getTreatmentPlan = asyncHandler(async (req, res) => {
  const trPlan = await TreatmentPlan.findOne({ where: { patientUuid: req.params.uuid } });
  const trPlanRecord = await TreatmentPlanRecord.findOne({
    where: { uuid: trPlan.treatmentPlanRecordUuid },
  });

  // Check if user's role is 'main' or 'doctor'
  const userUuid = req.user.uuid;
  const findUsersRole = await User.findOne({
    where: { uuid: userUuid },
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin or a doctor');
  }

  if (trPlan && trPlanRecord) {
    res.json({
      uuid: trPlan.uuid,
      patientUuid: trPlan.patientUuid,
      treatmentPlanRecordUuid: trPlan.treatmentPlanRecordUuid,
      date: trPlanRecord.date,
      examinationPlan: trPlanRecord.examinationPlan,
      treatmentPlan: trPlanRecord.treatmentPlan,
    });
  } else {
    res.status(404);
    throw new Error('Treatment plan not found');
  }
});

// @desc    Get all treatment plans
// @route   GET /api/tplan/all/:uuid
// @access  Private
const getAllTrPlansOfPatient = asyncHandler(async (req, res) => {
  // ДОПИСАТИ!!!!!!!!!!!!!!!!
  const trPlans = await TreatmentPlan.findAll({
    where: { patientUuid: req.params.uuid },
  });
  // const trPlansRecords = await TreatmentPlanRecord.findAll({
  //   where: { uuid: trPlans.treatmentPlanRecordUuid },
  // });

  // Check if user's role is 'main' or 'doctor'
  const userUuid = req.user.uuid;
  const findUsersRole = await User.findOne({
    where: { uuid: userUuid },
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin or a doctor');
  }

  if (trPlans && trPlansRecords) {
    res.json(trPlans, trPlansRecords);
    // {
    //   uuid: trPlans.uuid,
    //   patientUuid: trPlans.patientUuid,
    //   treatmentPlanRecordUuid: trPlans.treatmentPlanRecordUuid,
    //   date: trPlansRecords.date,
    //   examinationPlan: trPlansRecords.examinationPlan,
    //   treatmentPlan: trPlansRecords.treatmentPlan,
    // });
  } else {
    res.status(404);
    throw new Error('Treatment plans not found');
  }
});

// @desc    Get all treatment plans
// @route   GET /api/tplan/all
// @access  Private. For developers only
const getAllPlans = asyncHandler(async (req, res) => {
  const trPlans = await TreatmentPlan.findAll();
  const trPlansRecords = await TreatmentPlanRecord.findAll();

  // Check if user's role is 'main' or 'doctor'
  const userUuid = req.user.uuid;
  const findUsersRole = await User.findOne({
    where: { uuid: userUuid },
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin or a doctor');
  }

  if (trPlans) {
    res.json(trPlans);
  } else {
    res.status(404);
    throw new Error('Treatment plans not found');
  }
});

// @desc    Delete a treatment plan
// @route   DELETE /api/tplan/delete/:uuid
// @access  Private
const deleteTreatmentPlan = asyncHandler(async (req, res) => {
  const trPlan = await TreatmentPlan.findOne({ where: { uuid: req.params.uuid } });
  const trPlanRecord = await TreatmentPlanRecord.findOne({
    where: { uuid: trPlan.treatmentPlanRecordUuid },
  });

  // Check if user's role is 'main' or 'doctor'
  const userUuid = req.user.uuid;
  const findUsersRole = await User.findOne({
    where: { uuid: userUuid },
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin or a doctor');
  }

  if (trPlan) {
    await trPlan.destroy();
    await trPlanRecord.destroy();
    res.json({ message: 'Treatment plan removed' });
  } else {
    res.status(404);
    throw new Error('Treatment plan not found');
  }
});

// @desc    Update a treatment plan
// @route   PUT /api/tplan/update/:uuid
// @access  Private
const updateTreatmentPlan = asyncHandler(async (req, res) => {
  const trPlan = await TreatmentPlan.findOne({ where: { patientUuid: req.params.uuid } });
  const trPlanRecord = await TreatmentPlanRecord.findOne({
    where: { uuid: trPlan.treatmentPlanRecordUuid },
  });
  if (!(trPlan && trPlanRecord)) {
    res.status(404);
    throw new Error('Treatment plan not found');
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
    throw new Error('User is not a main admin or a doctor');
  }
  const { date, examinationPlan, treatmentPlan } = req.body;

  await trPlanRecord.set({ date, examinationPlan, treatmentPlan });
  await trPlanRecord.save();

  if (trPlan && trPlanRecord) {
    res.json({
      uuid: trPlan.uuid,
      patientUuid: trPlan.patientUuid,
      treatmentPlanRecordUuid: trPlan.treatmentPlanRecordUuid,
      date: trPlanRecord.date,
      examinationPlan: trPlanRecord.examinationPlan,
      treatmentPlan: trPlanRecord.treatmentPlan,
    });
  } else {
    res.status(400);
    throw new Error('Invalid treatment plan data');
  }
});

module.exports = {
  createTreatmentPlan,
  getTreatmentPlan,
  getAllTrPlansOfPatient,
  getAllPlans,
  deleteTreatmentPlan,
  updateTreatmentPlan,
};
