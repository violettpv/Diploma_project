const asyncHandler = require('express-async-handler');
const TreatmentPlan = require('../models/treatmentPlanModel');
const TreatmentPlanRecord = require('../models/treatmentPlanRecordModel');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Patient = require('../models/patientModel');
const { Op } = require('sequelize');

// @desc    Create a new treatment plan
// @route   POST /api/tplan/create
// @access  Private
const createTreatmentPlan = asyncHandler(async (req, res) => {
  const { patientUuid, date, examination, treatment } = req.body;
  if (!patientUuid || !date || !treatment) {
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

  const trPlanRecord = await TreatmentPlanRecord.create({
    date,
    examination,
    treatment,
  });
  const trPlan = await TreatmentPlan.create({
    patientUuid,
    treatmentPlanRecordUuid: trPlanRecord.uuid,
  });

  if (trPlan && trPlanRecord) {
    res.status(201).json({
      uuid: trPlan.uuid,
      patientUuid: trPlan.patientUuid,
      treatmentPlanRecordUuid: trPlan.treatmentPlanRecordUuid,
      date: trPlanRecord.date,
      examination: trPlanRecord.examination,
      treatment: trPlanRecord.treatment,
    });
  } else {
    res.status(400);
    throw new Error('Invalid treatment plan data');
  }
});

// @desc    Get the treatment plan by uuid
// @route   GET /api/tplan/get/:uuid
// @access  Private
const getTreatmentPlan = asyncHandler(async (req, res) => {
  const planRecord = await TreatmentPlanRecord.findByPk(req.params.uuid);

  // Check if user's role is 'main' or 'doctor'
  const findUsersRole = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin or a doctor');
  }

  if (planRecord) {
    res.json({
      uuid: planRecord.uuid,
      date: planRecord.date,
      examination: planRecord.examination,
      treatment: planRecord.treatment,
    });
  } else {
    res.status(404);
    throw new Error('Treatment plan not found');
  }
});

// @desc    Get all treatment plans
// @route   GET /api/tplan/all/:uuid?limit=&offset=
// @access  Private
const getAllPlansOfPatient = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const patient = await Patient.findByPk(req.params.uuid);
  const tPlans = await Patient.findByPk(patient.uuid, {
    attributes: ['uuid', 'surname', 'name'],
    include: [
      {
        model: TreatmentPlanRecord,
        through: { attributes: [] },
      },
    ],
    order: [[TreatmentPlanRecord, 'date', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset),
    subQuery: false,
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

  if (tPlans) {
    res.json(tPlans);
  } else {
    res.status(404);
    throw new Error('Treatment plans not found');
  }
});

// @desc    Delete the treatment plan
// @route   DELETE /api/tplan/delete/:uuid
// @access  Private
const deleteTreatmentPlan = asyncHandler(async (req, res) => {
  const trPlan = await TreatmentPlanRecord.findOne({ where: { uuid: req.params.uuid } });

  // Check if user's role is 'main' or 'doctor'
  const findUsersRole = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main' || usersRole === 'doctor')) {
    res.status(400);
    throw new Error('User is not a main admin or a doctor');
  }

  if (trPlan) {
    await trPlan.destroy();
    res.json({ message: 'Treatment plan removed' });
  } else {
    res.status(404);
    throw new Error('Treatment plan not found');
  }
});

// @desc    Update the treatment plan
// @route   PUT /api/tplan/update/:uuid
// @access  Private
const updateTreatmentPlan = asyncHandler(async (req, res) => {
  const trPlan = await TreatmentPlanRecord.findByPk(req.params.uuid);

  if (!trPlan) {
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

  const { date, examination, treatment } = req.body;

  trPlan.set({ date, examination, treatment });
  await trPlan.save();

  if (trPlan) {
    res.json({
      uuid: trPlan.uuid,
      date: trPlan.date,
      examination: trPlan.examination,
      treatment: trPlan.treatment,
    });
  } else {
    res.status(400);
    throw new Error('Invalid treatment plan data');
  }
});

// @desc    Find the treatment plan record by date
// @route   GET /api/tplan/find?uuid=&date=&month=&year=
// @access  Private
const findPlansByDate = asyncHandler(async (req, res) => {
  const { date, month, year } = req.query;
  const patient = await Patient.findByPk(req.query.uuid);
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }
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
  const tPlans = await Patient.findByPk(patient.uuid, {
    attributes: ['uuid', 'surname', 'name'],
    include: [
      {
        model: TreatmentPlanRecord,
        through: { attributes: [] },
        where: {
          date: {
            [Op.eq]: searchDate,
          },
        },
      },
    ],
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

  if (tPlans) {
    res.json(tPlans);
  } else {
    res.status(404);
    throw new Error('Treatment plans not found');
  }
});

module.exports = {
  createTreatmentPlan,
  getTreatmentPlan,
  getAllPlansOfPatient,
  findPlansByDate,
  deleteTreatmentPlan,
  updateTreatmentPlan,
};
