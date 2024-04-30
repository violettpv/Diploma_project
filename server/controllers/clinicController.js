const asyncHandler = require('express-async-handler');
const Clinic = require('../models/clinicModel');

// @desc   Create a profile for a clinic
// @route  POST /api/clinic
// @access Private (main's admin)
const createClinic = asyncHandler(async (req, res) => {
  const { name, address, phone, phone2, email, website } = req.body;

  // чи зробити перевірку тільки на клієнті??
  if (!name || !phone) {
    res.status(400);
    throw new Error('Fill at least name and phone fields');
  }

  // Check if current user's role is 'main'
  if (!req.user.roles.find((role) => role === 'main')) {
    res.status(403);
    throw new Error('You are not allowed to add information about clinic');
  }

  // [DON'T SURE IF IT'S NECESSARY] !!!!!!!!
  const clinicExists = await Clinic.findOne({ where: { name } });
  if (clinicExists) {
    res.status(400);
    throw new Error('Clinic already exists');
  }

  const clinic = await Clinic.create({
    name,
    address,
    phone,
    phone2,
    email,
    website,
  });

  if (clinic) {
    res.status(201).json({
      uuid: clinic.uuid,
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      phone2: clinic.phone2,
      email: clinic.email,
      website: clinic.website,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc  Get a profile of a clinic
// @route GET /api/clinic/get/:uuid
// @access Private (main's admin)
const getClinic = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findOne({ where: { uuid: req.params.uuid } });

  if (clinic) {
    res.status(200).json({
      uuid: clinic.uuid,
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      phone2: clinic.phone2,
      email: clinic.email,
      website: clinic.website,
    });
  } else {
    res.status(404);
    throw new Error('Clinic not found');
  }
});

// @desc  Update a profile of a clinic
// @route PUT /api/clinic/update/:uuid
// @access Private (main's admin)
const updateClinic = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findOne({ where: { uuid: req.params.uuid } });

  if (clinic) {
    clinic.name = req.body.name || clinic.name;
    clinic.address = req.body.address || clinic.address;
    clinic.phone = req.body.phone || clinic.phone;
    clinic.phone2 = req.body.phone2 || clinic.phone2;
    clinic.email = req.body.email || clinic.email;
    clinic.website = req.body.website || clinic.website;

    await clinic.save();

    res.status(200).json({
      uuid: clinic.uuid,
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      phone2: clinic.phone2,
      email: clinic.email,
      website: clinic.website,
    });
  } else {
    res.status(404);
    throw new Error('Clinic not found');
  }
});

// @desc  Delete a profile of a clinic
// @route DELETE /api/clinic/delete/:uuid
// @access Private (main's admin)
const deleteClinic = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findOne({ where: { uuid: req.params.uuid } });

  if (clinic) {
    await clinic.destroy();
    res.status(200).json('Clinic deleted successfully');
  } else {
    res.status(404);
    throw new Error('Clinic not found');
  }
});

module.exports = { createClinic, getClinic, updateClinic, deleteClinic };
